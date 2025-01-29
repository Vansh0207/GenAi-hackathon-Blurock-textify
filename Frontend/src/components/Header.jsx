import { Link } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { useState } from 'react';
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'
import { setAuthUser } from "../redux/authSlice";
import axios from 'axios';

export default function Header() {
  const { user } = useSelector(store => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);

  const logoutHandler = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/user/logout', { withCredentials: true });
      if (res.data.success) {
        navigate("/login");
        dispatch(setAuthUser(null));
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  }

  return (
    <header className="bg-gray-700 px-6 text-white shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-xl font-bold">
          <Link to={'/'} className="flex items-center justify-center gap-3">
            <img src="logo.png" alt="QuizLabs" className="md:h-20 h-16 mr-0" />
          </Link>
        </div>
        <nav className="flex items-center space-x-6">
          <Link to="/" className="hover:underline">
            Home
          </Link>
          <Link to="/history" className="hover:underline">
            History
          </Link>
          <Link to="/about" className="hover:underline">
            About
          </Link>
          <Link to="/contact" className="hover:underline">
            Contact
          </Link>

          {/* User profile icon with dropdown */}
          <div className="relative">
            <div onClick={toggleDropdown} className="cursor-pointer">
              <img
                src={user?.profilePicture || "/user.png"}
                alt="User Icon"
                className="w-8 h-8 rounded-full border-2 border-white"
              />
            </div>

            {/* Dropdown menu */}
            {
              user ? (isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md">
                  <ul className="py-2">
                    <li>
                      <Link
                        to={`/profile/${user?._id}`}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-200"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        My Profile
                      </Link>
                    </li>
                    <li>
                      <button
                        onClick={logoutHandler}
                        className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-200 text-left"
                      >
                        Logout
                      </button>
                    </li>
                  </ul>
                </div>
              )
              ) : (
                <Link to='/login'>
                  <button className="bg-red-500 hover:bg-red-700 transition-all duration-200 text-white font-bold py-2 px-4 rounded">Login</button>
                </Link>
              )
            }
          </div>
        </nav>
      </div>
    </header>
  );
}