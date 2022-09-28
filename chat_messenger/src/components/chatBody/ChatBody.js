import React, { useState, useEffect } from "react";
import "./chatBody.css";
import ChatList from "../chatList/ChatList";
import ChatContent from "../chatContent/ChatContent";
import axios from "axios";
import io from "socket.io-client";
const url = process.env.REACT_APP_BASE_URL
const socket = io(`${url}`)
const ChatBody = () => {
  const [user, setUser] = useState({})
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([])
  const [startChat, setStartChat] = useState(false)
  const [newUser, setNewUser] = useState({})
  const [userLeft, setUserLeft] = useState({})
  const [userJoin, setUserJoin] = useState({})
  const [file, selectFile1] = useState()
  const [type,setType] = useState('')
  let name = "admin"
  let room = user.email
  let userType = 'admin'
  useEffect(() => {
    if (room !== undefined) {
      socket.emit('join', { name, room, userType }, () => { })
    }
  }, [user])
  socket.on('usersall', (users) => {
    if (users.name !== 'admin') {
      setNewUser(users)
    }
  })

  socket.on('end', (message) => {
    axios({
      url: `${url}/api/updateStatus`,
      method: "PUT",
      data: { email: message.email, status: 'Offline' },
    })
      .then((res) => {
      })

      .catch((err) => {
      });
    setUserLeft(message)

  })
  socket.on('joinl', (message) => {
    axios({
      url: `${url}/api/updateStatus`,
      method: "PUT",
      data: { email: message.email, status: 'Online' },
    })
      .then((res) => {
      })

      .catch((err) => {
      });
    setUserJoin(message)

  })
  //sending msg
  const sendMessage = async (target, event) => {
    console.log(type)
    if (!file) {
      event.preventDefault();
      var d = new Date();
      socket.emit('sendMessage', message, name, room, d, false, "me", () => { setMessage(''); selectFile1('');setType('') });
      axios({
        url: `${url}/api/createmsg`,
        method: "POST",
        data: { name: name, message: message, msgid: room, type: "", date: d, seen: false, from: "admin@gmail.com", to: room },
      })
        .then((res) => {
        })
        .catch((err) => {
        });
    }
    else {
      var d = new Date();
      const file = event;
      const formData = new FormData();
      formData.append('file', file);
      formData.append("upload_preset", "ml_default");
      const data = await fetch('https://api.cloudinary.com/v1_1/dfkzxvvto/image/upload', {
        resource_type: 'auto',
        method: 'POST',
        body: formData
      }).then(r => r.json());
      socket.emit('upload', data.secure_url, name, room, d, false, "me", true,type,() => { setMessage(''); selectFile1('');setType('') });
      axios({
        url: `${url}/api/createmsg`,
        method: "POST",
        data: { name: name, message: data.secure_url, msgid: room, type: "", date: d, seen: false, from: "admin@gmail.com", to: room, img: true,imgtype:type },
      })
        .then((res) => {
        })
        .catch((err) => {
        });
    }
  }
  const handleCallback = (childData) => {
    setUser(childData)
    setStartChat(true)
  }
  return (
    <div className="main__chatbody container-lg row">
      <ChatList handlecallback={handleCallback} newUser={newUser} user={user} socket={socket} userLeft={userLeft} userJoin={userJoin} />
      {startChat ? <ChatContent user={user} selectFile1={selectFile1} file={file} message={message} socket={socket} setMessage={setMessage} sendMessage={sendMessage} userLeft={userLeft} userJoin={userJoin} setType={setType}/> : <h1>Admin Messages</h1>}
    </div>
  );

}
export default ChatBody;
