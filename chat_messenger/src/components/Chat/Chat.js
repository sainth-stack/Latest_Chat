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
    const [scroll, setScroll] = useState(0)
    const name = props.data.name
    const room = props.data.email ? props.data.email : props.data.room
    const msg = props.data.message
    const type = props.data.type
    const roomid = JSON.parse(localStorage.getItem('room'))
    const send = !roomid?.new ? false : true
    const [file, selectFile1] = useState('')
    const[type1,setType1] = useState('')
    let page = 1
    let pagesize = 20
    useEffect(() => {
        if (roomid) {
            let pagesize = 20;
            let page = 0
            axios({
                url: `${url}/api/getuserbyid/` + `${roomid.room}` + '/' + `${pagesize}` + `/` + `${page}`,
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
                    setMessages(res.data.data)
                    // scrollToBottom()
                })
                .catch((err) => {
                    console.log('failed', err)
                });
        }
    }, [])
    useEffect(() => {
        if (props.visible) {
            socket.emit('join', { name, room, msg, type, send }, () => { })
            localStorage.setItem('room', JSON.stringify({ name: roomid.name, room: roomid.room, new: false }))
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
            socket.on('file', (message) => {
                setMessages([...messages, message])
                if (message.user === "admin" && message.msgid !== null) {
                    setAdminIn(true)
                    // updateSeen()
                }
            })
            socket.on('joinl', (message) => {
                if (message.email === room) {
                    setAdminIn(true)
                    updateSeen()
                }
            })
            socket.on('end', (message) => {
                setAdminIn(false)
            })
        }
    }, [messages, props.visible])

    //sending msg
    const sendMessage = async (event, img, func1) => {
        event.preventDefault();
        if (message) {
            var d = new Date();
            if (file) {
                const formData = new FormData();
                formData.append('file', file);
                formData.append("upload_preset", "ml_default");
                const data = await fetch('https://api.cloudinary.com/v1_1/dfkzxvvto/image/upload', {
                    method: 'POST',
                    body: formData
                }).then(r => r.json());
                socket.emit('upload', data.secure_url, name, room, d, adminIn ? true : false, "other",true,type1,() => {setMessage('');selectFile1('')});
                // socket.emit('sendMessage',data.secure_url , name, room, d, adminIn ? true : false, "other", true , () => { setMessage(''); selectFile1('') });
                axios({
                    url: `${url}/api/createmsg`,
                    method: "POST",
                    data: { name: name, message: data.secure_url, msgid: room, type: "other", date: d, seen: false, from: room, to: 'admin@gmail.com', img:true,imgtype:type1 },

                })
                    .then((res) => {
                        console.log('success', res)
                        selectFile1('')
                    })
                    .catch((err) => {
                        console.log('failed', err)
                        selectFile1('')
                    });
            }
            else {
                socket.emit('sendMessage', message, name, room, d, adminIn ? true : false, "other", () => { setMessage(''); selectFile1('') });
                axios({
                    url: `${url}/api/createmsg`,
                    method: "POST",
                    data: { name: name, message: message, msgid: room, type: "other", date: d, seen: false, from: room, to: 'admin@gmail.com', img: false },
                })
                    .then((res) => {
                        console.log('success', res)
                        selectFile1('')
                    })
                    .catch((err) => {
                        console.log('failed', err)
                        selectFile1('')
                    });
            }
        }
    }
    const handleCallback = async () => {
        const finalData = await fetchUserData()
        setMessages(prevState => {
            return [...finalData, ...prevState];
        });
        // setLen(prevState =>{
        //   return prevState - finalData.length
        // })
        setScroll(finalData.length)

    }
    const fetchUserData = async () => {
        let cancel;
        const data = await axios({
            url: `${url}/api/getuserbyid/` + `${roomid.room}` + '/' + `${pagesize}` + `/` + `${page}`,
            method: "GET",
            cancelToken: new axios.CancelToken(c => cancel = c)
        })
        page = page + 1
        return data.data.data

    }
    return (
        <div>
            {props.visible &&
                <div className="container1" style={{ borderRadius: '20px' }}>
                    <InfoBar room={room} />
                    <Messages messages={messages} name={name} room={room} allseen={allSeen} handlecallback={handleCallback} scroll={scroll} message={message} />
                    <Input message={message} setMessage={setMessage} sendMessage={sendMessage} selectFile1={selectFile1} setType1={setType1} />
                </div>
            }
        </div>
    )
}
export default Chat;