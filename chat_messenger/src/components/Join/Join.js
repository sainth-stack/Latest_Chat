import React,{useState} from 'react';
import {Navigate,useNavigate,createSearchParams} from 'react-router-dom'
import './Join.css'
const Join = () => {
    const [name,setName]=useState('');
    const[room,setRoom]=useState('')
    const params = { chatname: name, room: room };
    const navigate=useNavigate()
    const navigateToChat=()=>{
      navigate({
        pathname: '/chat',
        search: `?${createSearchParams(params)}`,
      });
    }
    return (
        <div className="joinOuterContainer">
        <div className="joinInnerContainer">
          <h1 className="heading">Join</h1>
          <div>
            <input placeholder="Name" className="joinInput" type="text" onChange={(event) => setName(event.target.value)} />
          </div>
          <div>
            <input placeholder="Room" className="joinInput mt-20" type="text" onChange={(event) => setRoom(event.target.value)} />
          </div>
          {/* <navigate onClick={e => (!name || !room) ? e.preventDefault() : null} search={`/chat?name=${name}&room=${room}`}> */}
            <button className={'button mt-20'} type="submit" onClick={navigateToChat}>Sign In</button>
        </div>
      </div>
    )
}
export default Join;