import React, { useState } from 'react';

import './Input.css';

const Input = ({ setMessage, sendMessage, selectFile1,message,setType1 }) => {
  const selectFile = (e) => {
    setMessage(e.target.files[0].name)
    selectFile1(e.target.files[0])
    setType1(e.target.files[0].type)
  }
  return (
    <form className="form">
      <label className="addFiles custom-file-upload addicon" style={{cursor:'pointer'}}>
        <input type="file" onChange={selectFile} className="d-none" />
        <i className="fa fa-plus"></i>
      </label>
      <input
        className="input"
        type="text"
        placeholder="Type a message..."
        value={message}
        onChange={({ target: { value } }) => setMessage(value)}
        onKeyPress={event => event.key === 'Enter' ? sendMessage(event) : null}
      />
      <button className="sendButton" onClick={e => sendMessage(e)}>Send</button>
    </form>)
}


export default Input;