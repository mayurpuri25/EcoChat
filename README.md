COMPONENTS

Frontend Interface:
● Users can create their profiles by providing necessary details such as
username, email address, profile image and password.
● The frontend interface includes form fields for entering user information
and a submit button to create the profile.

Backend Functionality:
● User authentication and authorization are implemented to ensure
secure profile creation.
● User data is stored in the database (Sqlite) after validation and hashing
of passwords for security.

CREATE GROUP INTERFACE AND ADD MEMBERS:
Frontend Interface:
● Users can create new groups by providing a group name and selecting
members to add to the group.
Backend Functionality:
● The backend validates group creation requests and adds group
information to the database (sqlite).

CHAT GROUP TO TEXT, SEND IMAGES AND AI CHATBOT:
Frontend Interface:
● Users can send text messages, share images, and interact with the AI
chatbot.
● The interface includes text input fields, buttons for sending messages
and images, and a chatbot integration.
Backend Functionality:
● Message routes handle text and image messages, storing message
content, sender and recipient information in the database .
● Real-time communication (WebSockets) facilitates instant message
delivery and updates in group chats.

BACKEND IMPLEMENTATION:
User Authentication and Authorization:
● Implemented to ensure secure access to EcoChat functionalities.
Database (Sqlite):
● Serves as the central repository for EcoChat's data.
● Stores user data, chat messages, and group information.
● Provides relational database management for efficient data retrieval
and storage.

CNN Model Backend:
● Integrates the Convolutional Neural Network (CNN) model for image
classification.
● Handles requests to classify images uploaded by users into relevant
environmental categories.

Real-time Communication (WebSockets):
● Enables real-time communication experience in EcoChat.
● Facilitates instant message delivery and content moderation results.
● Broadcasts messages to all members of group chats in real-time
