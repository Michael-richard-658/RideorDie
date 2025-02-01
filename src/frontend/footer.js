import React, { useState } from 'react';
import insta from './assests/insta.jpg';
import git from './assests/git.png';
import linkdin from './assests/link.png';
import feedback from './assests/feedback.jpg';
import { Link } from 'react-router-dom';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import axios from 'axios';

export default function Footer() {
  const [open, setOpen] = useState(false);
  const [feed,setFeed]=useState('')

  const isLoggedIn = localStorage.getItem('log')

  function handleFeed(e){
    setFeed(e.target.value)
  }  

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
 
  async function sendFeedback() {
    if (feed) {
    const info = {statement:feed}
    try {
      const response = await axios.post('http://localhost:7000/sendfeedback',info,{
        headers:{"Content-Type":"application/json",Authorization:localStorage.getItem('token')}
      })
      console.log(response.data)
      setFeed('')
      setOpen(false);
    } catch (error) {
      
    }
  }
  }
  
  return (
    <div>
      <div className='footer-div'>
        <Link to='https://www.instagram.com/michael_richard_7_/' target='_new'>
          <img src={insta} alt='insta' />
        </Link>
        <Link to='https://www.linkedin.com/in/michael-richard-1b462b27b' target='_new'>
          <img src={linkdin} alt='Linkdin' />
        </Link>
        <Link to='https://github.com/Michael-richard-658' target='_new'>
          <img src={git} alt='Git' />
        </Link>
        
          <img onClick={handleClickOpen} src={feedback} alt='feedback' />
      </div>


      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Feedback</DialogTitle>
        <DialogContent>
          <p>{isLoggedIn ?  "We'd love to hear your thoughts and feedback!" : "You Must Login First!"}</p>
          <input type='text  '  placeholder='Feedback ' value={feed} onChange={isLoggedIn ? handleFeed : null} className='feedback-in' /> 
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">Close</Button>
          <Button onClick={sendFeedback} color="primary">Submit</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
