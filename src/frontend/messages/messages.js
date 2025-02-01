import React from 'react'
import { Link } from 'react-router-dom'

export default function Messages() {
    const isLoggedIn = localStorage.getItem('log')
    console.log(isLoggedIn)
    if(isLoggedIn==='false') return <Link to='/login'>Please Login first!</Link>
  return (
    <div>
      <h1>Messages here!</h1>
    </div>
  )
}
