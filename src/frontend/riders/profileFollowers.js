import axios from 'axios'
import React, { useEffect, useState,useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { CountContext } from './profile'

export default function ProfileFollowers({id,from,followers,following,open}) {
    //console.log(id)
    const [isFollowing,setIsFollowing] = useState(false)
    const isLoggedIn = localStorage.getItem('log')
    const nav =useNavigate()
    useEffect(()=>{
      if (isLoggedIn==='false') {
        nav('/login')
        
      }

    },[id])
    const {setPcount} = useContext(CountContext)
    async function addFollower() {
      try {
        const res = await axios.post('http://localhost:7000/riders/profile/addfollower',{id},{
          headers:{"Content-Type":'application/json',Authorization:localStorage.getItem('token')}
        })
        setIsFollowing(res.data.isFollowing)
        setPcount(prev => prev+1)
      }
       catch (error) {
        console.log(error)
      }
    
    }
    
    
    return (
    <div>
      <div >
        <div className='followers' onClick={open} >Followers:{followers}</div>
        <div className='folowing'  onClick={open} >Following:{following}</div>
        {from !== 'user'  ? (
  <div className='follow' onClick={addFollower}>+ Follow</div>
) : null}
      </div>
      <h3 className='follow-mess'>{isFollowing ? '"Already Following!"' : null}</h3>
    </div>
  )
}
