// src/reducers/index.js
import { createReducer } from '@reduxjs/toolkit';
import { setGroupName, setGroupID, setCurrentUserID, setCurrentUserName } from '../actions';

const initialState = {
  groupName: '',
  groupID: '',
  currentUserID: '',
  currentUserName: '',
};

const reducer = createReducer(initialState, (builder) => {
  builder
    .addCase(setGroupName, (state, action) => {
      state.groupName = action.payload;
    })
    .addCase(setGroupID, (state, action) => {
      state.groupID = action.payload;
    })
    .addCase(setCurrentUserID, (state, action) => {
      state.currentUserID = action.payload;
    })
    .addCase(setCurrentUserName, (state, action) => {
      state.currentUserName = action.payload;
    });
});

export default reducer;
