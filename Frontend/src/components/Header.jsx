import { Link } from "react-router-dom";

export default function Header() {
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
            <Link to="/profile">
              <img
                src="/user.png"
                alt="User Icon"
                className="w-8 h-8 rounded-full border-2 border-white"
              />
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}