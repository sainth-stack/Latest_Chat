import React from 'react';

import onlineIcon from '../../assets/onlineIcon.png';
import closeIcon from '../../assets/closeIcon.png';

import './InfoBar.css';

const InfoBar = ({ room }) => (
  <div className="infoBar" style={{position:"relative"}}>
    <div className="leftInnerContainer">
      {/* <h3 style={{fontSize:'15px'}}>Customer Support</h3> */}
    </div>
    <div className="rightInnerContainer">
      <a href="/"><img src={closeIcon} alt="close icon" /></a>
    </div>
  </div>
);

export default InfoBar;