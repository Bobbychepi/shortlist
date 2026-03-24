import React from "react";

interface SideMenuProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const SideMenu: React.FC<SideMenuProps> = ({ open, setOpen }) => {
  return (
    <>
      <div
        onClick={() => setOpen(false)}
        className={`fixed inset-0 bg-black/40 transition-opacity duration-500 ${
          open ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      />

      
      <aside
        className={`fixed top-0 right-0 h-full w-64 bg-white shadow-lg
        transform transition-transform duration-500 ease-out
        ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        <button
          onClick={() => setOpen(true)}
          className="p-4 text-left w-full font-semibold"
        >
        </button>

        <nav className="grid grid-rows-3 pr-4 gap-1 pl-4 mt-9">
          <a href="#">Profile</a>
          <hr className="border-t-2 border-gray-300 my-2 "/>
          <a href="#">Settings</a>
          <hr className="border-t-2 border-gray-300 my-2 "/>
          <a href="#">Logout</a>
          <hr className="border-t-2 border-gray-300 my-2 "/>
          
        </nav>
      </aside>
    </>
  );
};

export default SideMenu;
