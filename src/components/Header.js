import React from 'react';
import { Link } from 'react-router-dom';
import { auth } from '../firebase';
import { ThemeToggle } from './ThemeToggle';
import { ChangeLanguage } from './change-language';

function Header({ user, userDoc }) {
  console.log(userDoc);
  return (
    <header className="flex justify-between items-center p-2 bg-[#f9f5f1] dark:bg-gray-800 shadow-md">
      <div className="flex-shrink-0">
        <Link to="/" className="flex items-center font-semibold">
          <img
            src="../logo.png"
            width={100}
            alt="logo"
            className="dark:filter dark:invert"
          />
        </Link>
      </div>
      <nav className="flex space-x-4">
        <Link to="/" className="text-[#4a4a4a] dark:text-white font-medium hover:text-[#e6846e] dark:hover:text-[#fda085]">
          Shop
        </Link>
        <Link to="/about" className="text-[#4a4a4a] dark:text-white font-medium hover:text-[#e6846e] dark:hover:text-[#fda085]">
          About Us
        </Link>
        <Link to="/contact" className="text-[#4a4a4a] dark:text-white font-medium hover:text-[#e6846e] dark:hover:text-[#fda085]">
          Contact
        </Link>
        {userDoc?.isOwner && (
          <Link to="/add-product" className="text-[#4a4a4a] dark:text-white font-medium hover:text-[#e6846e] dark:hover:text-[#fda085]">
            Add Product
          </Link>
        )}
         {userDoc?.isOwner && (
          <Link to="order" className="text-[#4a4a4a] dark:text-white font-medium hover:text-[#e6846e] dark:hover:text-[#fda085]">
              Order
          </Link>
        )}
      </nav>
      <div className="flex items-center">
        {!user ? (
          <Link to="/auth" className="bg-[#e6846e] dark:bg-[#fda085] text-white py-2 px-4 rounded transition duration-300 hover:bg-[#d57058] dark:hover:bg-[#fc836e]">
            Sign In / Sign Up
          </Link>
        ) : (
          <>
            <span className="mr-4 text-[#4a4a4a] dark:text-white">Welcome, {userDoc.name}</span>
            <button
              onClick={() => auth.signOut()}
              className="bg-[#e6846e] dark:bg-[#fda085] text-white py-2 px-4 rounded transition duration-300 hover:bg-[#d57058] dark:hover:bg-[#fc836e]"
            >
              Sign Out
            </button>
          </>
        )}
        <ThemeToggle />
        <ChangeLanguage />
      </div>
    </header>
  );
}

export default Header;
