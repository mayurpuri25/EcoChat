import React, { useState} from "react";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";


const CreateGroupDialog = ({ visible, onHide }) => {
  const [groupName, setGroupName] = useState("");
  const [searchedUser, setSearchedUser] = useState("");
  const [members, setMembers] = useState(new Set()); // Using Set for efficient uniqueness

  const handleRemoveMember = (memberToRemove) => {
    const updatedMembers = new Set([...members].filter((member) => member !== memberToRemove));
    setMembers(updatedMembers);
  };

  const handleHide = () => {
    setGroupName('');
    setMembers(new Set()); // Create a new empty Set
    onHide(); // Call the original onHide function
  };

  const handleSubmit = async e => {
    const membersArray = Array.from(members);
    e.preventDefault();
    // Submit form data to the backend using fetch API
    try {
      const sessionID = localStorage.getItem('sessionID');
      const response = await fetch("http://127.0.0.1:5000/create_group", {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${sessionID}`, // Send session ID
          "Content-Type": "application/json",
        },
        body: JSON.stringify({"groupName":groupName, "members":membersArray }),
      });
      const data = await response.json();
      if (data.success)
        console.log(data); // Handle response from the backend as needed
      else
        console.error(data.message);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
    setMembers(new Set()); // Clear the added members after the form submission
    setGroupName(""); // Clear the group name after the form submission
  };

  const handleSearch = async e => {
    e.preventDefault();
    try {
      const sessionID = localStorage.getItem('sessionID');
      const response = await fetch('http://127.0.0.1:5000/search_user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({"username": searchedUser})
      });
      const data = await response.json();
      if (data.success)  {
        if (!members.has(searchedUser) && (data.id != sessionID)) {
          setMembers(new Set([...members, searchedUser])); // Add only if unique
        } else {
          console.log("Username already exists or invalid");
        }
      } else {
        console.error(data.message); // Handle login error
      }
    } catch (error) {
      console.error("error",error); // Handle network error
    }
    setSearchedUser(""); // Clear the search input after adding the user
  };

  return (
    <Dialog
      header="Create Group"
      visible={visible}
      style={{ backgroundColor: "var(--primary-color)", width: "50vw" }}
      onHide={handleHide} 
    >
      <form onSubmit={handleSubmit} className="p-fluid">
        <div className="p-inputgroup flex-1">
          <span className="p-inputgroup-addon">
            <i className="pi pi-users"></i>
          </span>
          <InputText
            placeholder="Group Name"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
          />
        </div>
        <br />

        <label htmlFor="username">Add Members:</label>
        <div className="p-inputgroup flex-1">
          <InputText
            placeholder="Enter Username"
            value={searchedUser}
            onChange={(e) => setSearchedUser(e.target.value)}
          />
          <Button
            icon="pi pi-search"
            className="p-button"
            onClick={handleSearch}
          />
        </div>
        <br />
        {members.size > 0 && (
        <div>
          <p>Members added:</p>
          <ul>
            {Array.from(members).map((member, index) => (
              <li key={index}>
                {member}
                <Button
                  icon="pi pi-times"
                  className="p-button p-button-outlined p-button-danger"
                  style={{ marginLeft: 10 }}
                  onClick={(e) => {
                    e.preventDefault();
                    handleRemoveMember(member)
                  }}
                />
              </li>
            ))}
          </ul>
        </div>
      )}
        <Button label="Create Group" type="submit" icon="mt-2" />
      </form>
    </Dialog>
  );
};

export default CreateGroupDialog;
