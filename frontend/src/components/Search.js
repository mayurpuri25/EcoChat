import React from "react";

const Search = () => {
  return (
    <div className="search">
      <div className="searchForm">
        <input
          type="text"
          placeholder="Search a user"
          //   onKeyDown={handleKey}
          //   onChange={(e) => setUsername(e.target.value)}
          //   value={username}
        />
      </div>
      {/* {err && <span>User not found!</span>}
      {user && ( */}
      <div className="userChat" >
        {/* <img src={user.photoURL} alt="" /> */}
        <div className="userChatInfo">
          {/* <span>{user.displayName}</span> */}
        </div>
      </div>
      {/* )} */}
    </div>
  );
};

export default Search;
