import React, { useState, useEffect } from "react";
import "./chatBody.css";
import ChatList from "../chatList/ChatList";
import ChatContent from "../chatContent/ChatContent";
import axios from "axios";
import io from "socket.io-client";
const url = process.env.REACT_APP_BASE_URL
const socket = io(`${url}`)
console.log(socket)
const ChatBody = () => {
  const [user, setUser] = useState({})
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([])
  const [startChat, setStartChat] = useState(false)
  const [newUser, setNewUser] = useState({})
  const [userLeft, setUserLeft] = useState({})
  let name = "admin"
  let room = user.email
  let userType = 'admin'
  useEffect(() => {
    if (room !== undefined) {
      socket.emit('join', { name, room, userType }, () => { })
    }
  }, [user])
  socket.on('usersall', (users) => {
    console.log(users)
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
        console.log('success', res)
      })

      .catch((err) => {
        console.log('failed', err)
      });
    setUserLeft(message)

  })
  //sending msg
  const sendMessage = (event) => {
    event.preventDefault();
    if (message) {
      var d = new Date();
      socket.emit('sendMessage', message, name, room, d, false, () => setMessage(''));
      axios({
        url: `${url}/api/update`,
        method: "PUT",
        data: { name: name, email: room, date: d, type: '', message: message, seen: false, msgId: 'admin@gmail.com' },
      })
        .then((res) => {
          console.log('success', res)
        })
        .catch((err) => {
          console.log('failed', err)
        });
    }
  }
  const handleCallback = (childData) => {
    setUser(childData)
    setStartChat(true)
  }
  return (
    <div className="main__chatbody">
      <ChatList handlecallback={handleCallback} newUser={newUser} user={user} userLeft={userLeft} socket={socket} />
      {startChat ? <ChatContent user={user} message={message} socket={socket} setMessage={setMessage} sendMessage={sendMessage} userLeft={userLeft} /> : <h1>Admin Messages</h1>}
    </div>
  );

}
export default ChatBody;
