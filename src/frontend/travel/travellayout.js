import React from 'react'
import Travelnav from './travelnav'
import { Outlet } from 'react-router-dom'

export default function TraveLayout() {
  return (
    <div>
      <Travelnav/>
      <Outlet />
    </div>
  )
}
