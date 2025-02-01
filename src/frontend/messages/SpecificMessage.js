import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { socket } from '../../App';
import { registerUser } from '../../App';



export default function SpecificMessage() {
  const [darkTheme, setDarkTheme] = useState(true);
  const [text, setText] = useState('');
  const [rec, setRec] = useState();
  const [sender, setSender] = useState('');
  const [currUser, setCurrUser] = useState({});
  const [count,setCount] = useState(0)
  const nav = useNavigate();
  const { id } = useParams();

  useEffect(() => {
   
    getRecipientAndSender();
   
  }, [id]);

  


  async function getRecipientAndSender() {
    try {
      const response = await axios.get('http://localhost:7000/messageTo', {
        headers: { id: id }
      });
      setRec(response.data);
   
    } catch (error) {
      nav('/riders');
      console.log(error);
    }

    try {
      const response = await axios.get('http://localhost:7000/messageFrom', {
        headers: {
          Authorization: localStorage.getItem('token')
        }
      });
      setSender(response.data);
    } catch (error) {
      nav('/riders');
      console.log(error);
    }
  }

  function switchTheme() {
    setDarkTheme((prev) => !prev);
  }

  function send() {
    if (text && sender && id) {
      if (currUser && Object.keys(sender).length > 0) {
        registerUser(sender, socket);
      }
      socket.emit('p-message', { text, from: sender.id, to: id, senderName: sender.name });
      setText('');
      setCount(prev => prev +1)
    }
  }

  return (
    <div
    style={{
      background: darkTheme ? 'black' : 'white',
      paddingBottom: '36%',
      transition: 'background-color .51s'
    }}
    
    >
      <Link to={`http://localhost:3000/riders/${id}`}>
        <p className={darkTheme ? 'home-arr' : 'home-arr-dark'}>&larr;</p>
      </Link>
      <button
        className='theme-messages'
        onClick={switchTheme}
        style={{
          padding: '1rem',
          marginLeft: '6rem',
          marginTop: '8rem',
          border: 'none',
          borderRadius: '5px',
          color: darkTheme ? 'black' : 'white',
          backgroundColor: darkTheme ? 'white' : 'black',
          transition: 'all 1s ease-in-out',
          transition: 'background-color 1s'
        }}
      >
        {darkTheme ? 'Light' : 'Dark'}
      </button>

      <div
        style={{
          position: 'absolute',
          backgroundColor: !darkTheme ? 'white' : 'black',
          borderLeft: `2px solid ${!darkTheme ? 'black' : 'white'}`,
          height: '100%',
          width: '80%',
          left: '19.8%',
          top: '0%',
          transition: 'background-color .51s'
        }}
      >
        <div
          style={{
            marginTop: '.5rem',
            color: !darkTheme ? 'black ' : 'white',
            width: '99%',
            borderRadius: '5px',
            marginLeft: '.5%',
            paddingTop: '.2rem',
            paddingBottom: '.2rem',
            border: `solid ${!darkTheme ? 'black' : 'white'} 3px`,
          }}
        >
          <div
            style={{
              display: 'flex',
              flexFlow: 'row',
              alignItems: 'center',
              justifyContent: 'left',
              gap: '4rem',
            }}
          >
            <p style={{ marginLeft: '15rem', fontSize: '1.2rem', fontWeight: '800' }}>
              {rec && rec.username}
            </p>
            <p
              style={{ marginLeft: '30rem', fontSize: '1.2rem', fontWeight: '800' }}
            >
              &bull; {rec && rec.experience}
            </p>
            <p style={{ fontSize: '1.2rem', fontWeight: '800' }}>
              &bull; {rec && rec.ridingpreference}
            </p>
          </div>
        </div>

        <input
          placeholder='Say Something . . .'
          value={text}
          onChange={(e) => setText(e.target.value)}
          style={{
            padding: '1rem',
            position: 'absolute',
            bottom: '1.5rem',
            marginLeft: '2rem',
            width: '85%',
            borderRadius: '5px',
          }}
        />
        <button
          onClick={send}
          style={{
            color: !darkTheme ? 'black' : 'white',
            cursor: 'grab',
            position: 'absolute',
            bottom: '1.3rem',
            right: '4%',
            border: 'none',
            fontSize: '3rem',
            background: darkTheme ? 'black' : 'white',
          }}
        >
          &#8680;
        </button>
      </div>
    </div>
  );
}
