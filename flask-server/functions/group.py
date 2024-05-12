from flask_wtf import FlaskForm
from wtforms import StringField, SubmitField
from wtforms.validators import InputRequired, Length

class GroupForm(FlaskForm):
    groupname = StringField(validators=[InputRequired(), Length(
        min=1, max=15)], render_kw={"placeholder":"Group Name"})
    submit = SubmitField("Create Group")

class GroupMembers(FlaskForm):
    submit = SubmitField("Add Member")