import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
import { useState } from 'react'
import Avatar from './chatpopup/avatar';
import SupportWindow from './chatpopup/supportWindow';
import Chat from './components/Chat/Chat';
function Popup() {
  const [visible, setVisible] = useState(false)
  const [data, setData] = useState({
    name: '',
    room: ''
  })
  const [chat, setChat] = useState(false)
  const handleCallback = (childData) => {
    setData(childData)
    if (chat === false) {
      setVisible(false)
      setChat(true)
    }
  }
  const close = () => {
    if (data.name === "") {
      setVisible(!visible)
    }
    if(data.name !== ""){
      setVisible(false)
      setChat(!chat)
    }
  }
  return (
    <div className="">
      <SupportWindow visible={visible} handlecallback={handleCallback} />
      <Chat visible={chat} data={data} />
      <Avatar onClick={() => close()} visible={visible} chat={chat}/>
    </div>
  );
}

export default Popup;
