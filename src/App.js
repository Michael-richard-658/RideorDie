import { Route, Routes } from 'react-router-dom';
import './frontend/App.css';
import HomeLayout from './frontend/layout';
import HomeBody from './frontend/home-body';
import TraveLayout from './frontend/travel/travellayout';
import Solos from './frontend/travel/solos';
import Login from './frontend/Login/login';
import CreateNew from './frontend/Login/createnew';
import Messages from './frontend/messages/messages';
import UserProfile from './frontend/Login/userprofile';
import Riders from './frontend/riders/riders';
import Profile, { isLoggedIn } from './frontend/riders/profile';
import SpecificSolo from './frontend/travel/specificsolo';
import EditUser from './frontend/Login/edituser';
import Aboutus from './frontend/aboutus';
import SpecificMessage from './frontend/messages/SpecificMessage';
import { io } from 'socket.io-client';
import { useEffect } from 'react';
import axios from 'axios';

export const socket = io('http://localhost:7000');

export async function getCurrentUser() {
  try {
    const response = await axios.get('http://localhost:7000/currUser', {
      headers: {
        Authorization: localStorage.getItem('token'),
      },
    });
    return response.data;
  } catch (error) {
    console.log('Error fetching current user:', error);
    return null;
  }
}

export function registerUser(currUser, socketFromApp) {
  if (currUser && Object.keys(currUser).length > 0) {
    socketFromApp.emit('m-register', currUser);
    //console.log('User registered:', currUser);
  }
}

function App() {
  useEffect(() => {
    if (isLoggedIn) {
      
    
    const handleRegistration = async () => {
      const currUser = await getCurrentUser(); 
      if (currUser) {
        registerUser(currUser, socket); 
        socket.emit('user-online',{online:true,fromId:currUser.id})
      }
    };


    handleRegistration();

    const handlePageLoad = () => handleRegistration();
    window.addEventListener('load', handlePageLoad);

   


    return () => {
      window.removeEventListener('load', handlePageLoad);
    };
  } else{

  
  }
}, []);

  useEffect(() => {
    if (isLoggedIn) {
      
    
    
    const handleMessage = (data) => {
      console.log('Message received:', data.result);
    };

    socket.on('p-message', handleMessage);

    return () => {
      socket.off('p-message', handleMessage); 
    };
  }
  

}, []);

  return (
    <div>
      <Routes>
        <Route path="/" element={<HomeLayout />}>
          <Route index element={<HomeBody />} />
          <Route path="/riders" element={<Riders />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/userprofile" element={<UserProfile />} />
          <Route path="/travel" element={<TraveLayout />}>
            <Route index element={<Solos />} />
            <Route path="communities" element={() => <h1>Hello world!</h1>} />
          </Route>
        </Route>
        <Route path="/:id" element={<SpecificMessage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/about" element={<Aboutus />} />
        <Route path="/createnew" element={<CreateNew />} />
        <Route path="/riders/:id" element={<Profile />} />
        <Route path="/travel/:id" element={<SpecificSolo />} />
        <Route path="/userprofile/edituser" element={<EditUser />} />
      </Routes>
    </div>
  );
}

export default App;
