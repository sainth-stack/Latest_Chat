import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
import  {useState} from 'react'
import Avatar from './chatpopup/avatar';
import SupportWindow from './chatpopup/supportWindow';
import Join from './components/Join/Join';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Popup from './popup';
import Admin from './admin/admin';
function App() {
  const [visible ,setVisible]=useState(false)

  return (
     <BrowserRouter>
     <Routes>
     <Route exact path='/' element={< Popup />}></Route>
      <Route exact path='/admin' element={< Admin />}></Route>
     </Routes>
   </BrowserRouter>
  );
}

export default App;
