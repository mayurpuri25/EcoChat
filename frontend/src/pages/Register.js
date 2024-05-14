import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Toast } from 'primereact/toast';

const Register = () => {
  const toast = useRef(null);
  const [file, setFile] = useState(null);
  const inputRef = useRef(null);
  const [formsData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  
  const showError = (msg) => {
    toast.current.show({severity:'error', summary: 'Error', detail:msg, life: 3000});
  }

  const showSuccess = (msg) => {
    toast.current.show({severity:'success', summary: 'Success', detail:msg, life: 3000});
  }

  const handleChange = (e) => {
    setFormData({ ...formsData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    // console.log(e.target.files[0]);

    setFile(e.target.files[0]);
  };

  const handleFileDelete = () => {
    setFile(null);
    inputRef.current.value = null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("username", formsData["username"]);
    formData.append("email", formsData["email"]);
    formData.append("password", formsData["password"]);
    formData.append("profile_image", file);

    try {
      let filename = null;
      if (file) {
        const formImageData = new FormData();
        formImageData.append("file", file);

        const uploadResponse = await fetch(
          "http://127.0.0.1:5000/upload_profile_image",
          {
            method: "POST",
            body: formImageData,
          }
        );
        const uploadData = await uploadResponse.json();
        if (!uploadData.success) {
          console.error("ERROR:", uploadData.message);
          // setFile(null); // Clear file input
          return;
        }
        filename = uploadData.filename;
      }
      const response = await fetch("http://127.0.0.1:5000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formsData["username"],
          email: formsData["email"],
          password: formsData["password"],
          image_profile: filename,
        }),
      });

      const data = await response.json();
      // console.log(data); // Handle network error

      if (response.ok) {
        showSuccess(data.message);
        window.location.href = "/login";
      } else {
        // console.error(data.message); // Handle registration error
        showError(data.message);
      }
    } catch (error) {
      // console.error(error); // Handle network error
      showError(error);
    }
  };

  // const handleSubmit = async e => {
  //   e.preventDefault();
  //   try {
  //     const formData = new FormData();
  //     formData.append('username', formsData['username']);
  //     formData.append('email', formsData['email']);
  //     formData.append('password', formsData['password']);
  //     formData.append('profile_image', file);
  //     console.log([...formData.entries()]);

  //     const response = await fetch('http://127.0.0.1:5000/register', {
  //       method: "POST",
  //       body: JSON.stringify(Object.fromEntries(formData)),
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //     });

  //     if (!response.ok) {
  //       throw new Error(`HTTP error! status: ${response.status}`);
  //     }
  //     const data = await response.json();
  //     console.log(data); // Handle network error

  //     if (response.ok) {
  //       window.location.href = '/login';
  //     } else {
  //       console.error(data.message); // Handle registration error
  //     }
  //   } catch (error) {
  //     console.error(error); // Handle network error
  //   }
  // };

  return (
    <div>
      <Toast ref={toast} />
      <h1>Register</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          placeholder="Username"
          onChange={handleChange}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
        />
        <label htmlFor="file">
          <i
            className="pi pi-user"
            style={{ fontSize: "1.5rem", color: "#708090", cursor: "pointer" }}
          ></i>
          <span>Add an avatar</span>
          <input
            id="file"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            ref={inputRef}
            style={{ display: "none" }}
          />
        </label>
        {file && (
          <div
            className="file-info"
            style={{ display: "contents", backgroundColor: "#708090" }}
          >
            <span>{file.name}</span>
            <i onClick={handleFileDelete} className="pi pi-times-circle"></i>
          </div>
        )}
        <button type="submit">Register</button>
      </form>
      <Link to="/login">Already Have An Account? Log In</Link>
    </div>
  );
};

export default Register;
