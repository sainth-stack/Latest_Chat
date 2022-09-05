import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import io from "socket.io-client";
import InfoBar from "../InfoBar/InfoBar";
import Input from "../Input/Input";
import Messages from "../Messages/Messages";
import TextContainer from "../TextContainer/TextContainer";
import './Chat.css'
import axios from 'axios'
const url = process.env.REACT_APP_BASE_URL
const socket = io(url)
const Chat = (props) => {
    const [message, setMessage] = useState('')
    const [messages, setMessages] = useState([])
    const [allSeen, setAllSeen] = useState(false)
    const [adminIn, setAdminIn] = useState(false)
    const name = props.data.name
    const room = props.data.email ? props.data.email : props.data.room
    const msg = props.data.message
    const type = props.data.type

    useEffect(() => {
        const roomid = JSON.parse(localStorage.getItem('room'))
        if (roomid) {
            axios({
                url: `${url}/api/getuserbyid/` + `${roomid.room}`,
                method: "GET",
            })
                .then((res) => {
                    console.log('success', res.data)
                    // let updateData = res.data.filter((item) => {
                    //     if (!(Object.keys(item).length === 0)) {
                    //         return {
                    //             ...item, message: item.message
                    //         }
                    //     }
                    // })
                    console.log(res.data.data)
                    setMessages(res.data.data)
                    // scrollToBottom()
                })
                .catch((err) => {
                    console.log('failed', err)
                });
        }
    },[])

    useEffect(() => {
        if (props.visible) {
            socket.emit('join', { name, room, msg, type }, () => { })
            return () => {
                props.socket.emit('leave', room, () => { })
            }
        }
    }, [name])
    const updateSeen = async () => {
        const finalData = messages.map((item) => {
            return { ...item, seen: true }
        })
        setMessages(finalData)
       await axios({
            url: `${url}/api/updateSeen`,
            method: "PUT",
            data: { name: name, email: room, seen: true },
        })
            .then((res) => {
                console.log('success', res)
            })
            .catch((err) => {
                console.log('failed', err)
            });
    }
    useEffect(() => {
        if (props.visible) {
            socket.on('message', (message) => {
                setMessages([...messages, message])
                if (message.user === "admin" && message.msgid !== null) {
                    setAdminIn(true)
                    // updateSeen()
                }
            })
            socket.on('joinl', (message) => {
                console.log(message,room)
                if (message.email === room) {
                    setAdminIn(true)
                    updateSeen()
                }
            })
            socket.on('end', (message) => {
                console.log("admon Exit")
                setAdminIn(false)
            })
        }
    }, [messages, props.visible])

    //sending msg
    const sendMessage = (event) => {
        event.preventDefault();
        if (message) {
            var d = new Date();
            socket.emit('sendMessage', message, name, room, d, adminIn ? true : false, "other", () => setMessage(''));
            axios({
                url: `${url}/api/createmsg`,
                method: "POST",
                data: {name:name,message:message, msgid:room, type: "other", date: d, seen: false,from:room,to:'admin@gmail.com' },

            })
                .then((res) => {
                    console.log('success', res)
                })
                .catch((err) => {
                    console.log('failed', err)
                });
        }
    }
    return (
        <div>
            {props.visible &&
                <div className="container1" style={{ borderRadius: '20px' }}>
                    <InfoBar room={room} />
                    <Messages messages={messages} name={name} room={room} allseen={allSeen} />
                    <Input message={message} setMessage={setMessage} sendMessage={sendMessage} />
                </div>
            }
        </div>
    )
}
export default Chat;