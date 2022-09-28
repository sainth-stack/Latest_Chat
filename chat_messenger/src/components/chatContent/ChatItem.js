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
    let msg = this.props.msg !== null ? this.props.msg.split("\n") : '';
    const msg1 = msg.map((item) => {
      return <p className="p-0 m-0">{item} <br /></p>
    })
    return (
      <div
        style={{ animationDelay: `0.8s` }}
        className={`chat__item ${this.props.user ? this.props.user : ""}`}
      >
        {!this.props.img && <div className="chat__item__content">
          <div className="chat__msg">{msg1}</div>
          <div className="chat__meta">
            <span>{moment(this.props.date).fromNow()}</span>
            <img src={this.props.user !== 'other' ? (this.props.userIn ? blueticks : (this.props.seen ? blueticks : greyticks)) : ''} />
            {/* <span>Seen 1.03PM</span> */}
          </div>
        </div>}
        {this.props.img &&
          <div>
            {console.log(this.props.imgtype)}
            <embed src={this.props.msg} type={this.props.imgtype == "application/pdf" ? this.props.imgtype : 'image/png'} height="250" width="300" />
            <span className="d-block bg-white pl-2" style={{ borderRadius: "0px 0px 10px 10px", color: 'gray' }}>{moment(this.props.date).fromNow()}</span>
          </div>}
        <div>
          <Avatar isOnline={this.props.user !== 'other' ? 'Online' : this.props.isOnline} image={this.props.image} />
        </div>
      </div>
    );
  }
}
