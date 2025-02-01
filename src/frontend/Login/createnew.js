import React, { useState } from 'react';
import create4 from '../assests/create-1.jpg';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';


export default function CreateNew() {
    const [userName, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [experienceLevel, setExperienceLevel] = useState(''); 
    const [preferredRiding, setPreferredRiding] = useState(''); 
    const [formComplete,setFormComplete] = useState('')
    const [createMessage,setCreatedMessage]= useState('')

    const nav = useNavigate()
    let tokenobj;
    function handleName(e) {
        setUserName(e.target.value);
    }
    function handleEmail(e) {
        setEmail(e.target.value);
    }
    function handlePassword(e) {
        setPassword(e.target.value);
    }
    function handleExperienceLevel(e) {
        setExperienceLevel(e.target.value);
    }
    function handlePreferredRiding(e) {
        setPreferredRiding(e.target.value);
    }

    async function createAcc() {
        if(userName&&email&&password&&experienceLevel&&preferredRiding){

        const user = {
          username: userName, 
          email: email,
          password: password,
          experience: experienceLevel,
          ridingpreference: preferredRiding
        };
        setEmail('')
        setExperienceLevel('')
        setUserName('')
        setFormComplete('')
        setPassword('')
        setPreferredRiding('')
       
      
        try {
          const response = await axios.post('http://localhost:7000/createacc', user, {
            headers: { 'Content-Type': 'application/json' }
          });
          tokenobj = await response.data
        } catch (error) {
            console.error('Error creating account:', error);
            
        }
        
        if (tokenobj) {
            console.log(tokenobj)
            localStorage.setItem('token',tokenobj.token)
            localStorage.setItem('log',true)
            setCreatedMessage(tokenobj.message)               

            setTimeout(()=>{
                nav('/userprofile')
            },1500)
        }
        
    }
    else{
        setFormComplete("Please Fill In Credentials To Complete The Process")
    }
      }

    return (
        <div className='create-m'>
           <Link to={'/'}>
            <p className='home-arr'>&larr;</p>
           </Link>
            <h1>Joining The RIDE Cult</h1>
            <div className='sign-up-box'>
                <h2>Create Account:</h2>
                <input
                    type='text'
                    placeholder='Enter Username'
                    value={userName}
                    onChange={handleName}
                />
                <input
                    type='email'
                    placeholder='Enter Email'
                    value={email}
                    onChange={handleEmail}
                />
                <input
                    type='password'
                    placeholder='Enter Password'
                    value={password}
                    onChange={handlePassword}
                />

                <select value={experienceLevel} onChange={handleExperienceLevel}>
                    <option value='' disabled>Select Experience Level</option>
                    <option value='Beginner'>Beginner</option>
                    <option value='Moderate'>Moderate</option>
                    <option value='Advanced'>Advanced</option>
                </select>

                <select value={preferredRiding} onChange={handlePreferredRiding} required={true}>
                    <option value='' disabled>Select Preferred Riding Type</option>
                    <option value='Solo'>Solo</option>
                    <option value='Community'>Community</option>
                    <option value='Both'>Both</option>
                </select>

                <button onClick={createAcc}>Create</button>
                <p>Already Have an Account?<Link to={'/login'}>Login. . .</Link></p>
            </div>
            <p className='formchecker'>{formComplete}</p>
            <p className='createdMessage'>{createMessage}</p>
            <div className='img-container'>
                <img src={create4} alt='vertical' />
            </div>
        </div>
    );
}
