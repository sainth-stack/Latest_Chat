import React from "react";
import Avatar from "./Avatar";
import moment from 'moment'
const ChatListItems = (props) => {

  const selectChat = (e) => {
    for (
      let index = 0;
      index < e.currentTarget.parentNode.children.length;
      index++
    ) {
      e.currentTarget.parentNode.children[index].classList.remove("active");
    }
    e.currentTarget.classList.add("active");
    props.handlecallback(props)
  };

  return (
    <div
      style={{ animationDelay: `0.${props.animationDelay}s` }}
      onClick={(e) => selectChat(e,)}
      className={`chatlist__item ${props.active ? props.active : ""
        } `}
    >
      <Avatar
        image={
          props.image ? props.image : "http://placehold.it/80x80"
        }
        isOnline={props.isOnline}
      />

      <div className="userMeta">
        <p>{props.name}</p>
        <span className={`${props.isOnline ? 'online' :'offline'} activeTime`}>{props.isOnline ? "Online" : moment(props.sentTime).fromNow()}</span>
      </div>
    </div>
  );

}
export default ChatListItems
