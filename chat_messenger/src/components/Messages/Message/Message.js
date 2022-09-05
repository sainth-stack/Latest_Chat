import React from 'react';
import axios from 'axios';
import './Message.css';
import greyIcon from './greyticks.png'
import blueIcon from './blueticks.png'
import ReactEmoji from 'react-emoji';
import moment from 'moment'
const Message = ({ message: { message, user, seen, type, date }, name, room, allseen }) => {
  const myArray = message.split("\n");
  const msg1 = myArray.map((item) => {
    return <p className='p-0 m-0'>{item} <br /></p>
  })
  let isSentByCurrentUser = false;
  if (type === 'other') {
    isSentByCurrentUser = true;
  }
  return (
    isSentByCurrentUser
      ? (
        <div className="messageContainer justifyEnd mt-2 mb-2">
          <div className="messageBox backgroundBlue p-0 d-flex flex-column">
            <p className="messageText colorWhite p-0 m-0 pl-2 w-70" style={{ width: '80%' }}>{msg1}</p>
            <div className='d-flex justify-content-between w-70'>
              <p className='date1 p-0 m-0 pl-2'>{moment(date).fromNow()}</p>
              <img className="" src={allseen ? blueIcon : (seen ? blueIcon : greyIcon)} style={{ width: '20px', height: '20px' }} />
            </div>
          </div>
        </div>
      )
      : (
        <div className="messageContainer justifyStart mt-1 mb-1">
          <div className="messageBox backgroundLight p-0 d-flex flex-column">
            <p className="messageText colorDark p-0 m-0 pl-2 w-80">{msg1}</p>
            <p className='date2 p-0 m-0 pl-2 w-70'>{moment(date).fromNow()}</p>
          </div>
        </div>
      )
  );
}

export default Message;