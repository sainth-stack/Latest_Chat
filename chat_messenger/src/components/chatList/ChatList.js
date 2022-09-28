import React, { useState, useEffect } from "react";
import "./chatList.css";
import ChatListItems from "./ChatListItems";
import axios from 'axios'
const url = process.env.REACT_APP_BASE_URL
const ChatList = (props) => {

  const img = "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTA78Na63ws7B7EAWYgTr9BxhX_Z8oLa1nvOA&usqp=CAU"
  const [users, setUsers] = useState([])
  const [value, setValue] = useState('')
  const [filterData, setFilterData] = useState([])
  useEffect(() => {
    if (!(Object.keys(props.newUser).length === 0)) {
      const finalUsers = users.filter((user) => user.email !== props.newUser.user.room)
      const updateUsers = [{ ...props.newUser.user, email: props.newUser.user.room }, ...finalUsers]
      setUsers(updateUsers)
    }
  }, [props.newUser])

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
  useEffect(() => {
    const finalData = users.map((item) => {
      if (item.email === props.userLeft.email) {
        return {
          ...item, status: "Offline"
        }
      }
      else {
        return item
      }
    })
    setUsers(finalData)
  }, [props.userLeft])
  useEffect(() => {
    const finalData = users.map((item) => {
      if (item.email === props.userLeft.email) {
        return {
          ...item, status: "Online"
        }
      }
      else {
        return item
      }
    })
    setUsers(finalData)
  }, [props.userJoin])
  const handleCallback = (childData) => {
    if (!(Object.keys(props.user).length === 0)) {
      props.socket.emit('leave', props.user.email, () => { })
    }
    props.handlecallback({ ...childData, message: childData.data.seenMessage ? [...childData.data.seenMessage, ...childData.data.unseenMessage] : null })
  }
  const handleChange = (e) => {
    setValue(e.target.value)
    const updateData = users.filter((item) => {
      if (item.name.includes(e.target.value)) {
        return true
      }
    })
    setFilterData(updateData)
  }

  return (
    <div className="main__chatlist col-sm-3">
      <div className="chatlist__heading">
        <h2>Chats</h2>
        <button className="btn-nobg">
          <i className="fa fa-ellipsis-h"></i>
        </button>
      </div>
      <div className="chatList__search">
        <div className="search_wrap">
          <input type="text" placeholder="Search Here" value={value} onChange={(e) => { handleChange(e) }} />
          <button className="search-btn">
            <i className="fa fa-search"></i>
          </button>
        </div>
      </div>
      <div className="chatlist__items">
        {users.length < 1 ? <h1>No Users Found</h1> : (value != '' ? filterData : users).map((item, index) => {
          return (
            <ChatListItems
              name={item.name}
              key={item._id}
              animationDelay={index + 1}
              active={item.status == "Online" ? "Online" : "Offline"}
              isOnline={item.status == "Online" ? "Online" : "Offline"}
              image={img}
              email={item.email !== undefined ? item.email : item.room}
              sentTime={item.updatedAt}
              handlecallback={handleCallback}
              data={item}
            />
          );
        })}
      </div>
    </div>
  )
}
export default ChatList

