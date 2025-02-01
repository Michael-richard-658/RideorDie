import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams,Link } from 'react-router-dom'


export default function SpecificSolo() {
  const [ride,setRide] = useState({})
  const nav=useNavigate()
  const isLoggenIn=localStorage.getItem('log')
  const {id} = useParams()
  useEffect(()=>{
    if(isLoggenIn===false || isLoggenIn===undefined || isLoggenIn===null){
      nav('/login?mess="Please Login First So you can join Rides!"')
  }else{
    getSpecificRide()
  }},[id])
    async function getSpecificRide() {
      try {
        const response = await axios.get('http://localhost:7000/getspecificsoloride',{
          headers:{id:id}
        })
        console.log(response.data)
        setRide(response.data)
      } catch (error) {
        console.log(error)
      }
    }

  return (
    <div>
      <Link to={'/'}>
            <p className='home-arr'>&larr;</p>
           </Link>
      <h1>Specifc Solo Ride here of ID:{id}</h1>
      <a href={ride.ride_url} target='_new'>View location</a>
    </div>
  )
}
