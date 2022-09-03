import React, { useState } from "react";
import img1 from '../assets/chat.svg'
import img2 from '../assets/x-lg.svg'
import '../App.css'
const Avatar = (props) => {
    const [hovered, setHovered] = useState(false)
    return (
        <div style={{ position: 'fixed', bottom: '24px', right: '24px',opacity:props.visible ? 1 : 1 }}>
            <div className="d-flex">
            {/* <p className="transition-3" style={{ opacity: hovered ? '1' : '0',marginRight:'120px',marginBottom:'40px',backgroundColor:'yellow' }}>
                Hey it's Adam
            </p> */}
            <div className="transition-3"
                // onMouseEnter={() => setHovered(true)}
                // onMouseLeave={() => setHovered(false)} 
                style={{}}
                onClick={()=>props.onClick && props.onClick()}>
                <img className="Image1" style={{cursor:'pointer'}} src={props.visible || props.chat ? img2 : img1} />
            </div>
            </div>
        </div>
    )
}

export default Avatar