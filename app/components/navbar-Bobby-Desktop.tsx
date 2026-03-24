import React, { useState } from "react";
import { Link } from "react-router";

import SideMenu from "../components/SideMenu";

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <nav className="navbar flex items-center justify-between px-[3%] ">
      <Link to="/">
        <p className="text-2xl font-bold text-gradient">Shortlist.</p>
      </Link>

      <Link to="/">
        <p className="text-[18px] pt-2 text-gradient">About The Creator</p>
      </Link>

      <div className="flex items-center gap-4">
        <Link to="/upload" className="primary-button w-fit">
          Upload Resume
        </Link>

        <button
          aria-label="Open menu"
          onClick={() => setOpen(true)}
          className="cursor-pointer"
        >
          <img
            src="/icons/ham-menu.svg" 
            alt="Hamburger Menu"
            className="w-7 h-7"
          />
        </button>
      </div>

      {/* Side menu */}
      <SideMenu open={open} setOpen={setOpen} />
    </nav>
  );
};

export default Navbar;
