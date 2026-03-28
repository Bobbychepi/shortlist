import { Link } from 'react-router'

const Navbar = () => {
  return (
    <nav className=" navbar  flex justify-between text-center">
        <p className="text-2xl font-bold text-gradient cursor-pointer">shortlist.</p>
      

      <div>
        <Link to="/upload" className="primary-button w-fit">
          Upload Resume
        </Link>
      </div>

      <div className="gap-8 flex">
        <Link to="/" className="p-2 rounded-full hover:bg-gray-300 hover:text-black transition-all duration-300">
          Home
        </Link>
        <Link to="/" className="p-2 rounded-full hover:bg-gray-300 hover:text-black transition-all duration-300">
          Tech Stack
        </Link>
        <Link to="/responses" className="p-2 rounded-full hover:bg-gray-300 hover:text-black transition-all duration-300">
          Responses
        </Link>
        <Link to="/" className="p-2 rounded-full hover:bg-gray-300 hover:text-black transition-all duration-300">
          Contact
        </Link>
      </div>

    </nav>
  )
}

export default Navbar
