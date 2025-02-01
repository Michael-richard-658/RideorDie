import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function EditUser() {
  const [info, setInfo] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('');
  const [preferredRiding, setPreferredRiding] = useState('');
  const [changed, setChanged] = useState(false);

  const nav = useNavigate()

  useEffect(() => {
    getEditData();
  }, []);

  useEffect(() => {
    if (info) {
      console.log(info)
      setName(info.name || '');
      setEmail(info.email || '');
      setPassword(info.password || '');
      setExperienceLevel(info.exp || '');
      setPreferredRiding(info.ridingpreference || '');
    }
  }, [info]);

  async function getEditData() {
    try {
      const response = await axios.get('http://localhost:7000/edituserinfo', {
        headers: { Authorization: localStorage.getItem('token') },
      });
      setInfo(response.data);
    } catch (error) {
      console.log(error);
    }
  }

  async function update(){

    const newInfo = {
      username:name,
      email:email,
      password:password,
      experience:experienceLevel,
      ridingpreference:preferredRiding
    }

   try {
      const response = await axios.put('http://localhost:7000/edituserinfo',newInfo,{
        headers:{'Content-Type':"application/json",Authorization:localStorage.getItem('token')}
      })
      setChanged(response.data.success)
    } catch (error) {
      console.log(error)
    }
  }

  if (changed) {
    setTimeout(() => {
      nav('/userprofile')
    }, 2000);
  }

  return (
    <div className='edituser-m-div'>
      <Link to={'/userprofile'}>
            <p className='home-arr'>&larr;</p>
           </Link>
      <div className='edituser-box'>
        <h1>Edit Here:</h1>
        <div className='edit-inputs'>
        <input
          type='text'
          placeholder='Enter Username'
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type='email'
          placeholder='Enter Email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type='text'
          placeholder='Enter Password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <select value={experienceLevel} onChange={(e) => setExperienceLevel(e.target.value)}>
          <option value='' disabled>
            Select Experience Level
          </option>
          <option value='Beginner'>Beginner</option>
          <option value='Moderate'>Moderate</option>
          <option value='Advanced'>Advanced</option>
        </select>
        <select value={preferredRiding} onChange={(e) => setPreferredRiding(e.target.value)} required>
          <option value='' disabled>
            Select Preferred Riding Type
          </option>
          <option value='Solo'>Solo</option>
          <option value='Community'>Community</option>
          <option value='Both'>Both</option>
        </select>
        </div>
        <button onClick={update} className='update-edituser'>Update</button>
      </div>
      <h2 className='onchange'>{changed ? "Successfully Updated! Redirecting . . ." : null}</h2>
    </div>
  );
}
