import React from 'react'
import { Link } from 'react-router'

const Navbar = () => {
  return (
    <nav className=" navbar  flex justify-between gap-[50%] text-center">
      <Link to="/">
        <p className="text-2xl font-bold text-gradient">SkillSwift</p>
      </Link>
      <Link to="/upload" className="primary-button w-fit">
        Upload Resume
      </Link>
    </nav>
  )
}

export default Navbar
