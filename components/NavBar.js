"use client";

import Link from "next/link";
import { useState } from "react";

export default function NavBar({ styles }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className={`${styles} flex relative justify-between items-center p-4 bg-osas-lightBlueGray text-white`}>
      {/* Hamburger Menu */}
      <button onClick={toggleMenu} className="flex flex-col space-y-1 z-10">
        <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${isOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
        <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${isOpen ? 'opacity-0' : ''}`} />
        <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${isOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
      </button>

      {/* Centered Logo */}
      <Link href="/" className="absolute left-1/2 -translate-x-1/2 text-xl font-bold">
        ACE
      </Link>

      {/* Mobile Menu */}
      <div className={`absolute top-[56px] right-0 w-64 bg-osas-lightBlueGray shadow-lg transition-transform duration-300 transform ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col p-4 space-y-4">
          <Link href="/" className="hover:text-gray-300">Home</Link>
          <Link href="/anonymous" className="hover:text-gray-300">Anonymous</Link>
          <Link href="/gallery" className="hover:text-gray-300">Gallery</Link>
          <Link href="/results" className="hover:text-gray-300">Results</Link>
        </div>
      </div>
    </nav>
  );
}