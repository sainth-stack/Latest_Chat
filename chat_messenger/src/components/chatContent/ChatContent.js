import React, { Component, useState, useRef, useEffect, useCallback } from "react";
import "./chatContent.css";
import Avatar from "../chatList/Avatar";
import ChatItem from "./ChatItem";
import axios from 'axios'
const url = process.env.REACT_APP_BASE_URL
const ChatContent = (props) => {
  const messagesEndRef = useRef(null)
  const messagesStrRef = useRef(null)
  const [message1, setMessage1] = useState('')
  const img = "https://pbs.twimg.com/profile_images/1055263632861343745/vIqzOHXj.jpg"
  const [data, setData] = useState([])
  const [myMessage, setMyMessage] = useState(false)
  const [isOnline2, setIsOnline] = useState(props.user.isOnline)
  const [userIn, setUserIn] = useState(false)
  const [called, setCalled] = useState()
  const count = useRef(0)
  let page = 1
  let pagesize = 20
  const observer = useRef()
  const lastElement = useCallback(node => {
    if (observer.current) observer.current.disconnect()
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        if (called !== node && count.current >= 3) {
          console.log(count)
          setCalled(node)
          fetchData()
        }
      }
    })
    if (node) observer.current.observe(node)
  }, [])
  const scrollToBottom = () => {
    messagesEndRef.current.scrollIntoView({ behavior: "auto", block: "end", inline: "nearest" })
  }
  const scrollToCenter = () => {
    messagesStrRef.current.scrollIntoView({block: "start", inline: "start" })
  }
  // useEffect(() => {
  //   scrollToBottom()
  // })
  const fetchData = async () => {
    const finalData = await fetchUserData()
    setData(prevState => {
      return [...finalData, ...prevState];
    });
    if (finalData.length !== 0) {
      console.log(lastElement)
      scrollToCenter()
    }
  }

  useEffect(() => {
    props.socket.on('message', (message) => {
      const updateData = [...data, { message: message.message, type: myMessage ? '' : 'other', msgid: 'hello', date: message.date, seen: message.seen }]
      setData(updateData)
      setMyMessage(false)
      scrollToBottom()
      console.log(props.user.email, message.msgid)
      if (props.user.email == message.email) {
        setIsOnline('Online')
        // changeSeen()
      }
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
  const fetchUserData = async () => {
    let cancel;
    const data = await axios({
      url: `${url}/api/getuserbyid/` + `${props.user.email}` + '/' + `${pagesize}` + `/` + `${page}`,
      method: "GET",
      cancelToken: new axios.CancelToken(c => cancel = c)
    })
    page = page + 1
    return data.data.data

  }
  useEffect(() => {
    let cancel;
    axios({
      url: `${url}/api/getuserbyid/` + `${props.user.email}` + '/' + `${pagesize}` + `/` + '0',
      method: "GET",
      cancelToken: new axios.CancelToken(c => cancel = c)
    })
      .then((res) => {
        setData(res.data.data)
        scrollToBottom()
      })
      .catch((err) => {
        console.log('failed', err)
      });
  }, [props.user])

  const sendMessage = (e) => {
    setMyMessage(true)
    scrollToBottom()
    props.sendMessage(e)
  }
  const onChangeMessage = (e) => {
    props.setMessage(e.target.value)
    setMessage1(e.target.value)
  }
  const image = "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTA78Na63ws7B7EAWYgTr9BxhX_Z8oLa1nvOA&usqp=CAU";
  return (
    <div className="main__chatcontent col-sm-9">
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
              count.current = count.current + 1;
              return <div ref={lastElement} >
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
              return <div ref={messagesStrRef}>
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
