import React, { useState, useEffect } from "react";
import img3 from '../../assets/send.svg'
import axios from 'axios'
import Select from "react-select";
import './styles.css'
import { Navigate, useNavigate, createSearchParams } from 'react-router-dom'
var d = new Date();
const url = process.env.REACT_APP_BASE_URL
const SupportWindow = (props) => {
    const [data, setData] = useState({
        name: '',
        email: '',
        message: '',
        type: ''
    })
    const [visible, setVisible] = useState(true)
    const handleChangeSearch = (e) => {
        let updatedData = { ...data };
        updatedData[e.target.name] = e.target.value;
        setData(updatedData);
    };
    const params = { chatname: data.name, room: data.email };
    const navigate = useNavigate()
    const navigateToChat = async () => {
        localStorage.setItem('room', JSON.stringify({ name: data.name, room: data.email ,new:true}))
        var d = new Date();
       await axios({
            url: `${url}/api/create`,
            method: "POST",
            data: { name: data.name, email: data.email, socketid: data.email, type: data.type, date: d, seen: false },
        })
            .then((res) => {
                console.log('success', res)
            })
            .catch((err) => {
                console.log('failed', err)
            });
       await axios({
            url: `${url}/api/createmsg`,
            method: "POST",
            data: {name: data.name,message:`Name:${data.name + "\n"}    Email:${data.email + "\n"}   Type:${data.type + '\n'}   Message:${data.message + "\n"}`, msgid: data.email, type: "other", date: d, seen: false,from:data.email,to:'admin@gmail.com' },
        })
            .then((res) => {
                console.log('success', res)
            })
            .catch((err) => {
                console.log('failed', err)
            });
        props.handlecallback(data)
    }

    // const sendmail = () => {
    //     // axios({
    //     //     url: "http://localhost:5000/sendGmail",
    //     //     method: "POST",
    //     //     data: { data: data },
    //     // })

    //     //     .then((res) => {
    //     //         //  setVisible(false)
    //     //         console.log('success', res)
    //     //     })

    //     //     .catch((err) => {
    //     //         console.log('failed', err)
    //     //     });
    //     getOrCreateUser(
    //         user => {
    //             getOrCreateChat(
    //                 chat => console.log('success', chat)
    //             )
    //         }
    //     )
    // }
    // const handleChange = ({ target: { name, value, label } }) => {
    //     let updatedData = { ...data };
    //     updatedData[name] = value;
    //     setData(updatedData);
    //   };
    const options = [
        { key: "Please Select", label: "Please Select", value: "" },
        { key: 'Cancel Token', label: 'Cancel Token', value: 'Cancel Token' }, { key: 'Technical Issue', label: 'Technical Issue', value: 'Technical Issue' }

    ]
    let updatedOptions = options.map((item) => (item.key));
    return (
        <div className="supportWindow" style={{ opacity: visible && props.visible ? '1' : '0' }}>
            <div className="container" style={{ backgroundColor: '#F67280', height: '70px', alignItems: '' }}>
                <div className="text-center ml-1 mt-5" >
                    <p className="" style={{ color: 'white', width: '250px' }}>
                        Please fill out the form below to start chatting with the next available agent.
                    </p>

                </div>
            </div>
            <div className="text-center mt-4" style={{ backgroundColor: 'white', height: '390px' }}>
                <input
                    required
                    style={{ height: '40px' }}
                    type="text"
                    className='input-box mt-3'
                    placeholder="Name"
                    name="name"
                    value={data.name}
                    onChange={handleChangeSearch}
                />
                <input
                    required
                    style={{ height: '40px' }}
                    type="text"
                    className="input-box mt-2"
                    placeholder="Email"
                    name="email"
                    value={data.email}
                    onChange={handleChangeSearch}
                />
                <select
                    placeholder="Select"
                    style={{ height: '40px' }}
                    value={updatedOptions.filter(function (option) {
                        return option === data.type;
                    })}
                    multiple={false}
                    onChange={(e) =>
                        handleChangeSearch({
                            target: {
                                name: "type",
                                value: e.target.value,
                                label: e.label,
                            },
                        })
                    }
                    className="input-box selct mt-2"
                >
                    {updatedOptions.map((option, index) => (
                        <option value={option} key={index}>
                            {option}
                        </option>
                    ))}
                </select>
                <div className="form-group mt-2">
                    <textarea
                        id="message"
                        className="input-box2 p-3"
                        name="message"
                        placeholder="Message"
                        rows="3"
                        value={data.message}
                        onChange={handleChangeSearch}
                    ></textarea>
                    <button
                        className="btn input-box mt-2"
                        style={{ backgroundColor: '#F67280', color: 'white' }}
                        onClick={(e) => navigateToChat()}                    >
                        <img src={img3} className='mr-1' />
                        Send
                    </button>

                </div>
            </div>
        </div>
    )
}
export default SupportWindow