import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import '../Login/login.css'
import axios from 'axios'
import { registerUser, socket } from '../../App'
export default function Login() {
  const [searchparams] = useSearchParams()
  
  
  const mess = searchparams.get('mess')
  const nav = useNavigate()
  const isLoggedIn = localStorage.getItem('log')
  useEffect(()=>{
    if (isLoggedIn ? isLoggedIn.toString()==='true' : false) {
      nav('/userprofile')
    }
  },[isLoggedIn])
    const [email,setEmail] =  useState('')
    const [errorMessage,setErrorMessage]= useState('')
    const [pass,setPass] = useState('')
    let info;
    function handeEmail(e){
        setEmail(e.target.value)
    }
    function handlePass(e){
        setPass(e.target.value)
    }

    async function Login() {

      const logger = {
        email:email,
        password:pass
      } 
      setEmail('')
      setPass('')

      try {
        const response = await axios.post('http://localhost:7000/login',logger,{
          headers: { 'Content-Type': 'application/json' }
        })
        .then(response =>{
          info =  response.data
        })
        if (info.token) {  
          const currUser = {id:info.id,name:info.name}
          registerUser(currUser,socket)
          localStorage.setItem('token',info.token)
          localStorage.setItem('log',true)
           nav('/userprofile')
        }
      } catch (error) {
        console.log(error)
        setErrorMessage(error.response.data)
      }
    }
    

  return (
    <div className='login-m'>
       <Link to={'/'}>
            <p className='home-arr'>&larr;</p>
           </Link>
           <h3 className='q-mess'>{mess ? mess : null}</h3>
        <div className='login-box' >
        <h1>Login</h1>
        <input type='email' value={email} onChange={handeEmail}  placeholder='Enter-Email'/> 
        <input type='text' value={pass} onChange={handlePass} placeholder='Enter-Password'/>
        <button onClick={Login}>Login</button> 
        <p>Dont have One?<Link to={'/createnew'}>Create one!</Link> </p>
        </div>
        {errorMessage ? <h3 className='errormessage'>{errorMessage}</h3> : null}
    </div>
  )
}
