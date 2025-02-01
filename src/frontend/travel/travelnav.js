import React from 'react'
import './travel.css'
import {  NavLink } from 'react-router-dom'


export default function Travelnav() {
  return (
    <div>
      <div className='travel-nav-div'>
      <NavLink to={'/travel'} end style={({ isActive }) => ({
            color: isActive ? '#898121 ' : 'black',
            textDecoration: isActive ? 'underline' : 'none',
          })}>
        <h1>Solo Rides</h1>
      </NavLink >
      <NavLink to={'communities'} style={({ isActive }) => ({
            color: isActive ? '#88C273 ' : 'black',
            textDecoration: isActive ? 'underline' : 'none',
          })}>
        <h1> Group Rides </h1>
      </NavLink>
      </div>
    </div>
  )
}
