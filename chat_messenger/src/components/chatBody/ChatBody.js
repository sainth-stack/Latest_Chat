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
  const sendMessage = (event) => {
    event.preventDefault();
    if (message) {
      var d = new Date();
      socket.emit('sendMessage', message, name, room, d, false, "me", () => setMessage(''));
      axios({
        url: `${url}/api/update`,
        method: "PUT",
        data: { name: name, email: room, date: d, type: '', message: message, seen: false, msgId: 'admin@gmail.com' },
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
      {startChat ? <ChatContent user={user} message={message} socket={socket} setMessage={setMessage} sendMessage={sendMessage} userLeft={userLeft} userJoin={userJoin} /> : <h1>Admin Messages</h1>}
    </div>
  );

}
export default ChatBody;
