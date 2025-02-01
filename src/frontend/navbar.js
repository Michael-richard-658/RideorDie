import React from 'react';
import profile from './assests/profile.png'; 
import {  Link, NavLink } from 'react-router-dom';


export default function Navbar() {


  return (
    <div>
      <div className='nav'> 
        <NavLink 
          to='/' 
          style={({ isActive }) => ({
            textDecoration: isActive ? 'underline' : 'none',
            color: isActive ? 'crimson' : 'black',
          })}
        >
          <h1 className='slogun'>#RIDE</h1>
        </NavLink>
       
          <NavLink to={'/riders'}   style={({ isActive }) => ({
            color: isActive ? 'crimson' : 'white',
            textDecoration: isActive ? 'underline' : 'none',
          })}>
          <p> Riders </p>
          </NavLink>



        <NavLink 
          to='/travel' 
          style={({ isActive }) => ({
            color: isActive ? 'crimson' : 'white',
            textDecoration: isActive ? 'underline' : 'none',
          })}
        >
          <p>Travel</p>
        </NavLink>
        <NavLink 
          to='/messages' 
          style={({ isActive }) => ({
            color: isActive ? 'crimson ' : 'white',
            textDecoration: isActive ? 'underline' : 'none',
          })}
        >
          <p>Messages</p>
        </NavLink>
        <Link to={'/login'}>
        <img className='profile-png' src={profile} alt='Profile' />
        </Link>
      </div>
      
    </div>
  );
}
