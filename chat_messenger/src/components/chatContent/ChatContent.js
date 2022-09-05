import React, { Component, useState, useRef, useEffect, useCallback } from "react";
import "./chatContent.css";
import Avatar from "../chatList/Avatar";
import ChatItem from "./ChatItem";
import axios from 'axios'
const url = process.env.REACT_APP_BASE_URL
const ChatContent = (props) => {
  const messagesEndRef = useRef(null)
  const [message1, setMessage1] = useState('')
  const img = "https://pbs.twimg.com/profile_images/1055263632861343745/vIqzOHXj.jpg"
  const [data, setData] = useState([])
  const [myMessage, setMyMessage] = useState(false)
  const [isOnline2, setIsOnline] = useState(props.user.isOnline)
  const [userIn, setUserIn] = useState(false)
  const [messageLimit, setMessageLimit] = useState(20)
  let page=1
  const observer = useRef()
  const lastElement = useCallback(node => {
    if (observer.current) observer.current.disconnect()
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        console.log('calling')
        fetchUserData()
      }
    })
    if (node) observer.current.observe(node)
  }, [])
  const scrollToBottom = () => {
    messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
  }
  useEffect(() => {
    scrollToBottom()
  })
  useEffect(() => {
    props.socket.on('message', (message) => {
      const updateData = [...data, { message: message.message, type: myMessage ? '' : 'other', msgid: 'hello', date: message.date, seen: message.seen }]
      setData(updateData)
      setMyMessage(false)
      console.log(props.user.email, message.msgid)
      if (props.user.email == message.email) {
        setIsOnline('Online')
        // changeSeen()
      }
      scrollToBottom()
    })
  }, [data, myMessage])
  const changeSeen = async () => {
    const data1 = data.map((item) => {
      return {
        ...item, seen: true
      }
    })
    setData(data1)
  }
  useEffect(() => {
    if (!(Object.keys(props.userLeft).length === 0) && props.userLeft.email == props.user.email) {
      setIsOnline('Offline')
      setUserIn(false)
    }
  }, [props.userLeft])
  useEffect(() => {
    if (!(Object.keys(props.userJoin).length === 0) && props.userJoin.email == props.user.email) {
      setIsOnline('Online')
    }
  }, [props.userJoin])
  useEffect(() => {
    if (!(Object.keys(props.userJoin).length === 0) && props.userJoin.email === props.user.email) {
      setUserIn(true)
      changeSeen()
    }
  }, [props.userJoin])

  const fetchUserData = () => {
    console.log(data)
    let pagesize=10
    axios({
      url: `${url}/api/getuserbyid/` + `${props.user.email}` + '/' + `${pagesize}` + `/` + `${page}`,
      method: "GET",
    })
      .then((res) => {
        page=page+1
        let updateData = [...data,...res.data.data]
        console.log(updateData)
        setData(updateData)
        scrollToBottom()
      })
      .catch((err) => {
        console.log('failed', err)
      });
  }
  useEffect(() => {
    fetchUserData()
  }, [props.user])

  const sendMessage = (e) => {
    setMyMessage(true)
    props.sendMessage(e)
    scrollToBottom()
  }
  const onChangeMessage = (e) => {
    props.setMessage(e.target.value)
    setMessage1(e.target.value)
  }
  const myScript = (e) => {
    console.log(e.target)
  }
  const image = "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTA78Na63ws7B7EAWYgTr9BxhX_Z8oLa1nvOA&usqp=CAU";
  return (
    <div className="main__chatcontent" onScroll={(e) => myScript(e)}>
      <div className="content__header">
        <div className="blocks">
          <div className="current-chatting-user">
            <Avatar
              isOnline={isOnline2}
              image={image}
            />
            <p>{props.user.name}</p>
          </div>
        </div>
        <div className="blocks">
          <div className="settings">
            <button className="btn-nobg">
              <i className="fa fa-cog"></i>
            </button>
          </div>
        </div>
      </div>
      <div className="content__body">
        <div className="chat__items">
          {data.map((itm, index) => {
            if (index === 1) {
                return <div ref={lastElement}>
                  <ChatItem
                    animationDelay="1"
                    key={index}
                    user={itm.type ? itm.type : "me"}
                    msg={itm.message}
                    image={itm.type ? image : image}
                    isOnline={isOnline2}
                    name={props.user.name}
                    email={props.user.email}
                    date={itm.date !== undefined ? itm.date : itm.createdAt}
                    seen={itm.seen}
                    userIn={userIn}
                  />
                </div>
              }
              else {
                return <div>
                  <ChatItem
                    animationDelay="1"
                    key={index}
                    user={itm.type ? itm.type : "me"}
                    msg={itm.message}
                    image={itm.type ? image : image}
                    isOnline={isOnline2}
                    name={props.user.name}
                    email={props.user.email}
                    date={itm.date !== undefined ? itm.date : itm.createdAt}
                    seen={itm.seen}
                    userIn={userIn}
                  />
                </div>
              }
          })}
          <div ref={
            messagesEndRef} />
        </div>
      </div>
      <div className="content__footer">
        <div className="sendNewMessage">
          <button className="addFiles">
            <i className="fa fa-plus"></i>
          </button>
          <input
            type="text"
            placeholder="Type a message here"
            onChange={(e) => onChangeMessage(e)}
            value={props.message}
            onKeyPress={event => event.key === 'Enter' ? sendMessage(event) : null}
          />
          <button className="btnSendMsg" id="sendMsgBtn" onClick={(e) => sendMessage(e)}>
            <i className="fa fa-paper-plane"></i>
          </button>
        </div>
      </div>
    </div>
  );
}
export default ChatContent
