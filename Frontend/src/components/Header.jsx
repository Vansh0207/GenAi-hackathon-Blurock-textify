import { Link } from "react-router-dom";
import { useSelector } from 'react-redux'
import InitialsAvatar from 'react-initials-avatar';

export default function Header() {
  const { user } = useSelector(store => store.auth);

  return (
    <header className="bg-gray-700 text-white shadow-lg">
      <div className="container mx-auto flex justify-between items-center p-4">
        <div className="text-xl font-bold">
          <Link to="/">QuizLabs</Link>
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
          <div className="relative">
            <div className="relative">
              <Link to={`/profile/${user?._id}`} className="cursor-pointer">
                <img
                  src={user?.profilePicture || "/user.png"}
                  alt="User Icon"
                  className="w-8 h-8 rounded-full border-2 border-white"
                />
              </Link>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}