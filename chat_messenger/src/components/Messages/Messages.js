import React from 'react';

import ScrollToBottom from 'react-scroll-to-bottom';

import Message from './Message/Message';

import './Messages.css';

const Messages = ({ messages, name ,room,allseen}) => (
  <ScrollToBottom className="messages">
    <div className="container" style={{ backgroundColor: '#F67280', height: '80px', alignItems: 'center' }}>
      <div className="text-center container2" >
        <p className="paragraph" style={{ color: 'white', width: '300px'}}>
        Welcome to Aurora e-Labs. We build custom SW applications to help improve your business.
        </p>

      </div>
    </div>
    {messages.map((message, i) => <div key={i}><Message message={message} name={name} room={room} allseen={allseen}/></div>)}
  </ScrollToBottom>
);

export default Messages;