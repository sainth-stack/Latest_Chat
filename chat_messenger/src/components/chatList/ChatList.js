import React, { useState, useEffect } from "react";
import "./chatList.css";
import ChatListItems from "./ChatListItems";
import axios from 'axios'
const url = process.env.REACT_APP_BASE_URL
console.log(url)
const ChatList = (props) => {

  const img = "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTA78Na63ws7B7EAWYgTr9BxhX_Z8oLa1nvOA&usqp=CAU"
  const [users, setUsers] = useState([])


  useEffect(() => {
    if (!(Object.keys(props.newUser).length === 0)) {
      const finalUsers = users.filter((user) => user.room !== props.newUser.user.room)
      const updateUsers = [props.newUser.user, ...finalUsers]
      setUsers(updateUsers)
    }
  }, [props.newUser])

  useEffect(() => {
    if (!(Object.keys(props.userLeft).length === 0)) {
      const finalUsers = users.map((user) => {
        if (user.room === props.userLeft.email) {
          const data = { ...user, status: 'Offline' }
          let final = {
            name: data.name,
            active: '',
            email: data.room,
            isOnline: '',
            animationDelay: 1,
            image: img
          }
          props.handlecallback(final)
          return {
            ...data
          }
        }
        else {
          return user
        }
      })
      setUsers(finalUsers)
    }
  }, [props.userLeft])

  useEffect(() => {
    axios({
      url: `${url}/api/getusers`,
      method: "GET",
    })
      .then((res) => {
        console.log('success', res.data.data)
        setUsers(res.data.data)
      })

      .catch((err) => {
        console.log('failed', err)
      });
  }, [])
  const handleCallback = (childData) => {
    if ( !(Object.keys(props.user).length === 0)) {
      console.log(props.user)
      console.log('leave')
      props.socket.emit('leave', props.user.email, () => { })
    }
    props.handlecallback(childData)
  }
  return (
    <div className="main__chatlist">
      <div className="chatlist__heading">
        <h2>Chats</h2>
        <button className="btn-nobg">
          <i className="fa fa-ellipsis-h"></i>
        </button>
      </div>
      <div className="chatList__search">
        <div className="search_wrap">
          <input type="text" placeholder="Search Here" required />
          <button className="search-btn">
            <i className="fa fa-search"></i>
          </button>
        </div>
      </div>
      <div className="chatlist__items">
        {users.length < 1 ? <h1>No Users Found</h1> : users.map((item, index) => {
          return (
            <ChatListItems
              name={item.name}
              key={item._id}
              animationDelay={index + 1}
              active={item.status == "Online" ? "active" : ""}
              isOnline={item.status == "Online" ? "active" : ""}
              image={img}
              email={item.email !== undefined ? item.email : item.room}
              sentTime={item.updatedAt}
              handlecallback={handleCallback}
            />
          );
        })}
      </div>
    </div>
  )
}
export default ChatList

