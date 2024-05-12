from flask import Flask, jsonify, render_template, request, url_for
from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin
import os
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from datetime import datetime
from flask_socketio import SocketIO
from werkzeug.utils import secure_filename
from flask import send_from_directory
from PIL import Image, ImageOps
import numpy as np
import tensorflow as tf
from keras import models

model = models.load_model("model/CNN/keras_model.h5", compile=False) # Load the model
class_names = open("model/CNN/labels.txt", "r").readlines() # Load the labels

app = Flask(__name__)
CORS(app, origins=['http://localhost:3000', 'http://127.0.0.1:3000']) # Enable CORS route
bcrypt = Bcrypt(app)

# Load environment variables from .env file 
if os.path.exists('.env'):
    from dotenv import load_dotenv
    load_dotenv()

# Database Configuration
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('SQLALCHEMY_DATABASE_URI')
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['UPLOAD_FOLDER'] = './uploads'
if not os.path.exists(app.config['UPLOAD_FOLDER']):
    os.makedirs(app.config['UPLOAD_FOLDER'])
db = SQLAlchemy(app)

# socketio = SocketIO(app, cors_allowed_origins="*")  # Add this line to enable CORS for SocketIO
socketio = SocketIO(app, cors_allowed_origins=["http://localhost:3000", "http://127.0.0.1:3000"])


# User's Table
class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)

# group's Table
class Groups(db.Model, UserMixin):
    group_ID = db.Column(db.Integer, primary_key=True)
    group_name = db.Column(db.String(255), unique=True, nullable=False)
    admin_ID = db.Column(db.Integer, nullable=False)

# group member's Table
class Group_members(db.Model, UserMixin):
    group_ID = db.Column(db.Integer, db.ForeignKey('groups.group_ID'), primary_key=True)
    user_ID = db.Column(db.Integer, db.ForeignKey('user.id'), primary_key=True)

# message Table
class Message(db.Model, UserMixin):
    message_ID = db.Column(db.Integer, primary_key=True)
    sender_ID = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    group_ID = db.Column(db.Integer, db.ForeignKey('groups.group_ID'))
    recipient_ID = db.Column(db.Integer, db.ForeignKey('user.id'))
    message_text = db.Column(db.Text)
    timestamp = db.Column(db.DateTime, nullable=False, default=datetime.now)
    message_image = db.Column(db.Text)  # Store image filename


@app.route("/")
def home():
    return render_template('home.html')

# Dashboard Route
@app.route("/dashboard", methods=['GET'])
def dashboard():
    authorization_header = request.headers.get('Authorization')

    if authorization_header:
        try:
            session_id = authorization_header.split()[1]
            user = User.query.filter_by(id=session_id).first()
            if user:
                response = {"username": user.username, "email": user.email}
                return jsonify(response), 200
            else:
                return jsonify({"error": "User not found"}), 404
        except IndexError:
            return jsonify({"error": "Malformed Authorization header"}), 400
    else:
        return jsonify({"error": "Authorization header is missing"}), 400

# Login Route
@app.route("/login", methods=['GET', 'POST'])
def login():
    data = request.json
    username = data['username']
    password = data['password']
    
    user = User.query.filter_by(username=username).first()
    if user:
        if bcrypt.check_password_hash(user.password_hash, password):
            # Authentication successful
            sessionID = user.id  
            # Here you might want to store the sessionID in your database or cache for later verification
            response = {'success': True, 'sessionID': sessionID}
            return jsonify(response), 200
        else:
            # Authentication failed
            response = {'success': False, 'message': 'Invalid username or password'}
            return jsonify(response), 401
    else:
        # Authentication failed
        response = {'success': False, 'message': 'Invalid username or password'}
        return jsonify(response), 401

# Register Route
@app.route("/register", methods=['GET', 'POST'])
def register():
    data = request.json
    username = data['username']
    email =  data['email']
    password = data['password']

    user = User.query.filter_by(username=username).first()

    if not user:
        hashed_password = bcrypt.generate_password_hash(password)
        new_user = User(username=username, email=email, password_hash=hashed_password)
        db.session.add(new_user)
        db.session.commit()
        response = {'success': True}
        return jsonify(response), 200
    else:
        # Registration failed
        response = {'success': False, 'message': 'Invalid username or password'}
        return jsonify(response), 401

# Create New Group Route
@app.route("/create_group", methods=['GET', 'POST'])
def create_group():
    data = request.json
    groupname = data.get('groupName')
    members = data.get('members')
    admin_id = request.headers.get('Authorization').split()[1]

    if not data or not data.get("groupName") or not data.get("members"):
        response = {'success': False, "message":"Missing required fields"}
        return jsonify(response), 400
    else:
        # creating new group entry in a DB
        new_group = Groups(group_name=groupname, admin_ID=admin_id)
        db.session.add(new_group)
        db.session.commit()

    # Access the group_ID of the newly inserted row
    new_group_id = new_group.group_ID
    created_group = Groups.query.filter_by(group_ID=new_group_id).first()

    if created_group:
        for member in members:
            user = User.query.filter_by(username=member).first()
            new_group_member = Group_members(group_ID=new_group_id, user_ID=user.id)
            db.session.add(new_group_member)
            db.session.commit()
            if not new_group_member:
                response = {'success': False, "message":"Error In Adding Members To A Group"}
                return jsonify(response), 400
            
        response = {'success': True, "message":'GROUP CREATED SUCCESSFULLY!'}
        return jsonify(response), 200
    else:
        response = {'success': False, "message":"Error In Creating a Group"}
        return jsonify(response), 400
    

# Search User Route Using Username
@app.route("/search_user", methods=['GET', 'POST'])
def search_user():
    data = request.json
    username = data.get('username') 
    user = User.query.filter_by(username=username).first()
    # authorization_header = request.headers.get('Authorization')
    
    if user:
        response = {'success': True, 'id': user.id, 'username': user.username}
        return jsonify(response), 200
    else:
        # No user found
        response = {'success': False, 'message': 'Invalid username'}
        return jsonify(response), 404
    
# Show group Route
@app.route("/show_group", methods=['GET', 'POST'])
def show_group():
    # data = request.json
    user_id = request.headers.get('Authorization').split()[1]
    # user_id= data.get('user_id')
    admin_groups = Groups.query.filter_by(admin_ID=user_id).all()
    other_groups = Group_members.query.filter_by(user_ID=user_id).all()
    if admin_groups or other_groups:
        response = {'success': True, 'groups': []}
        for group in admin_groups:
            group_info = {
                'group_ID': group.group_ID,
                'group_name': group.group_name,
                'admin_ID': group.admin_ID
            }
            response['groups'].append(group_info)

        for other in other_groups:
            group_id =  other.group_ID
            user_group = Groups.query.filter_by(group_ID=group_id).first()
            group_info = {
                'group_ID': user_group.group_ID,
                'group_name': user_group.group_name,
                'admin_ID': user_group.admin_ID
            }
            response['groups'].append(group_info)


        return jsonify(response), 200
    
    else:
        response = {'success': False, 'message': 'No Groups Present'}
        return jsonify(response), 404
    
# group_ID parameter
@app.route("/group_param", methods=['GET', 'POST'])
def group_param():
    data = request.json

    if not data:
        response = {'success': False, "message":"No group chat is selected"}
        return jsonify(response), 400
    
    param = data.get('group_ID')
    param_group = Groups.query.filter_by(group_ID=param).first()
    
    if param_group:
        response = {'success': True, 'id': param_group.group_ID, 'name': param_group.group_name, 'admin': param_group.admin_ID}
        return jsonify(response), 200
    else:
        # No group found
        response = {'success': False, 'message': 'Invalid Group ID'}
        return jsonify(response), 404
    
# send message
@app.route("/send_text", methods=['POST'])
def send_text():
    data = request.json
    text = data.get('text') 
    senderID = data.get('senderID') 
    groupID = data.get('groupID') 
    timestamp = datetime.strptime(data.get('timestamp') , '%Y-%m-%d %H:%M:%S')
    filename = data.get('filename')  # Get the filename

    if not data:
        response = {'success': False, "message":"ERROR IN SENDING!"}
        return jsonify(response), 400
    else:
        # entering text information in message table
        new_message = Message(sender_ID=senderID, group_ID=groupID, recipient_ID='', message_text=text, timestamp=timestamp, message_image=None if not data.get("filename") else f"http://127.0.0.1:5000/uploads/{filename}")  # Save the full URL
        db.session.add(new_message)
        db.session.commit()
        
        if not new_message:
                response = {'success': False, "message":"ERROR IN DATABASE!"}
                return jsonify(response), 400
            
        response = {'success': True, "message": 'MESSAGE STORED SUCCESSFULLY!', "data": {
            'message': {
                'message_ID': new_message.message_ID,
                'sender_ID': new_message.sender_ID,
                'group_ID': new_message.group_ID,
                'text': new_message.message_text,
                'timestamp': new_message.timestamp.isoformat(),
                'sender_username': search_username(new_message.sender_ID),
                'image_url': new_message.message_image  # Send the image URL in the response
            }
        }}
        socketio.emit('message', response['data']['message'])  # Broadcasting the new message
        return jsonify(response), 200

    
# Route to upload images
@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'success': False, 'message': 'No file part'}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({'success': False, 'message': 'No selected file'}), 400
    
    # Save the uploaded image
    filename = secure_filename(file.filename)
    file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
    # return jsonify({'success': True, 'filename': filename}), 200
    
    file_path=f"./uploads/{filename}"
    class_name, confidence_score = classify_image(file_path) # Classify the uploaded image

    # Decide whether to store the image or not based on the classification result
    if "Environment" in class_name:
        # Store the image in the database
        # Your code to store the image in the database goes here
        return jsonify({'success': True, 'message': 'Image stored successfully', 'filename': filename}), 200
    else:
        os.remove(file_path) # remove the image from the storage 
        return jsonify({'success': False, 'message': 'Image not related to the environment'}), 200

    
# Function to classify the image
def classify_image(image_path):
    # Create the array of the right shape to feed into the keras model
    data = np.ndarray(shape=(1, 224, 224, 3), dtype=np.float32)

    # Load and preprocess the image
    image = Image.open(image_path).convert("RGB")
    size = (224, 224)
    image = ImageOps.fit(image, size, Image.Resampling.LANCZOS)
    image_array = np.asarray(image)
    normalized_image_array = (image_array.astype(np.float32) / 127.5) - 1
    data[0] = normalized_image_array

    # Predict the model
    prediction = model.predict(data)
    index = np.argmax(prediction)
    class_name = class_names[index]
    confidence_score = prediction[0][index]

    return class_name, confidence_score

# get messages
@app.route("/get_messages", methods=['GET', 'POST'])
def get_messages():
    data = request.json
    groupID = data.get('groupID') 
    messages = Message.query.filter_by(group_ID=groupID).all()

    if messages:
        response = {'success': True, 'messages': []}
        for message in messages:
            sender_username = search_username(message.sender_ID) 
            msg = {
                'message_ID': message.message_ID,
                'sender_ID': message.sender_ID,
                'group_ID': message.group_ID,
                'text': message.message_text,
                'timestamp': message.timestamp.isoformat(),  # Convert timestamp to ISO format
                'sender_username': sender_username
            }

             # Check if the message has an image
            if message.message_image:
                msg['image_url'] = message.message_image  # Send image URL directly
                
            response['messages'].append(msg)
        return jsonify(response), 200
    else:
        response = {'success': False, "message":"ERROR IN RETRIEVING MESSAGES FROM THE DATABASE OR NO MESSAGE AVAILABLE!"}
        return jsonify(response), 400


# function to send the image from the local storage
@app.route('/uploads/<filename>')
def get_image(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

# function to search user using userID
def search_username(id): 
    user = User.query.filter_by(id=id).first()
    if user:
        return user.username
    else:
        # No user found
        return 0
    
@socketio.on('connect')
def test_connect():
    print('Client connected')

@socketio.on('disconnect')
def test_disconnect():
    print('Client disconnected')

if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    socketio.run(app, debug=True)