import React, { useCallback, useEffect, useRef, useState } from 'react';

import ScrollToBottom, { useScrollToBottom } from 'react-scroll-to-bottom';

import Message from './Message/Message';

import './Messages.css';

const Messages = ({ messages, name, room, allseen, date, handlecallback, scroll,message }) => {
  const count = useRef(0)
  const observer = useRef()
  const end = useRef()
  const messagesStrRef = useRef()
  const [called, setCalled] = useState()
  useEffect(() => {
    end.current.scrollIntoView({ behavior: "auto", block: "end", inline: 'end' })
  }, [message])
  const lastElement = useCallback(node => {
    if (observer.current) observer.current.disconnect()
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        if (called !== node && count.current >= 1) {
          setCalled(node)
          handlecallback()
        }
      }
    })
    if (node) observer.current.observe(node)
  }, [])
  if (scroll > 0) {
    messagesStrRef.current.scrollIntoView({ behavior: "auto", block: "start", inline: 'start' })
  }
  return (
    <ScrollToBottom className="messages" >
      <div className="container" style={{ backgroundColor: '#F67280', height: '80px', alignItems: 'center' }}>
        <div className="text-center container2" >
          <p className="paragraph" style={{ color: 'white', width: '300px' }}>
            Welcome to Aurora e-Labs. We build custom SW applications to help improve your business.
          </p>

        </div>
      </div>
      {messages.map((message, i) => {
        if (i == 5) {
          count.current = count.current + 1;
          return <div key={i} ref={lastElement}>
            <Message message={message} name={name} room={room} allseen={allseen} date={date} />
          </div>
        }
        else if (19 == i + 1) return <div key={i} ref={messagesStrRef}>
          <Message message={message} name={name} room={room} allseen={allseen} date={date} />
        </div>
        else return <div key={i}>
          <Message message={message} name={name} room={room} allseen={allseen} date={date} />
        </div>
      }

      )}
      <div ref={end}/>
    </ScrollToBottom>)
}

export default Messages;