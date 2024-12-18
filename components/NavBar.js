"use client";

import Link from "next/link";
import { useState } from "react";

export default function NavBar({ styles }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav
      className={`${styles} flex fixed top-0 left-0 items-center z-50 p-4 bg-osas-lightBlueGray text-white w-screen`}
    >
      {/* Mobile Menu */}
      <div
        className={`absolute top-[56px] right-0 w-64 bg-osas-lightBlueGray z-50 shadow-lg transition-transform duration-300 transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col p-4 space-y-4">
          <Link href="/" className="hover:text-gray-300">
            Home
          </Link>
          <Link href="/anonymous" className="hover:text-gray-300">
            Anonymous
          </Link>
          <Link href="/gallery" className="hover:text-gray-300">
            Gallery
          </Link>
          <Link href="/results" className="hover:text-gray-300">
            Results
          </Link>
        </div>
      </div>

      {/* Centered Logo */}
      <div className="flex-1 flex justify-center">
        <Link href="/" className="text-xl font-bold">
          ACE
        </Link>
      </div>

      {/* Hamburger Menu */}
      <button onClick={toggleMenu} className="flex flex-col space-y-1 z-50">
        <span
          className={`block w-6 h-0.5 bg-white transition-all duration-300 ${
            isOpen ? "rotate-45 translate-y-1.5" : ""
          }`}
        />
        <span
          className={`block w-6 h-0.5 bg-white transition-all duration-300 ${
            isOpen ? "opacity-0" : ""
          }`}
        />
        <span
          className={`block w-6 h-0.5 bg-white transition-all duration-300 ${
            isOpen ? "-rotate-45 -translate-y-1.5" : ""
          }`}
        />
      </button>
    </nav>
  );
}
