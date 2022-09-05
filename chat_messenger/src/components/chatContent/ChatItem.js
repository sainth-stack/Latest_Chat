import React, { Component } from "react";
import Avatar from "../chatList/Avatar";
import axios from 'axios'
import greyticks from '../../assets/greyticks.png'
import blueticks from '../../assets/blueticks.png'
import moment from 'moment'
export default class ChatItem extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    let msg=this.props.msg !== null ? this.props.msg.split("\n") : '';
    const  msg1=msg.map((item)=>{
      return <p className="p-0 m-0">{item} <br /></p>
    })
    return (
      <div
        style={{ animationDelay: `0.8s` }}
        className={`chat__item ${this.props.user ? this.props.user : ""}`}
      >
        <div className="chat__item__content">
          <div className="chat__msg">{msg1}</div>
          <div className="chat__meta">
            <span>{moment(this.props.date).fromNow()}</span>
            <img src={this.props.user !== 'other' ? (this.props.userIn ? blueticks : (this.props.seen ? blueticks : greyticks)) : ''} />
            {/* <span>Seen 1.03PM</span> */}
          </div>
        </div>
        <Avatar isOnline={this.props.user !== 'other' ? 'Online' : this.props.isOnline} image={this.props.image} />
      </div>
    );
  }
}
