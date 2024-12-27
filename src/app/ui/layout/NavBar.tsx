// components/NavBar.js
import ThemeSwitch from "@/app/lib/ThemeSwitch/ThemeSwitch";
import Image from "next/image";
import Link from "next/link";

const NavBar = () => {
  return (
    <nav className="sticky top-0 bg-violet-400 dark:bg-gray-900 text-white p-4 z-10">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <Image
            src="/control-panel/dg-logo-white.png"
            alt="Dhobi G."
            className="mx-5"
            width={100}
            height={10}
          />
          <ThemeSwitch />
        </div>
        <div className="hidden md:flex space-x-4">
          {/* <Link href="/dashboard" className="text-white hover:text-gray-400">Home</Link>
          <Link href="/about" className="text-white hover:text-gray-400">About</Link>
          <Link href="/services" className="text-white hover:text-gray-400">Services</Link>
          <Link href="/contact" className="text-white hover:text-gray-400">Contact</Link> */}
        </div>
        {/* <button className="md:hidden text-white focus:outline-none">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            ></path>
          </svg>
        </button> */}
      </div>
    </nav>
  );
};

export default NavBar;
