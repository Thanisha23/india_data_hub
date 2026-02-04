"use client";

import { LogIn, Search, User, Menu, X } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface NavbarProps {
  onSearch?: (query: string) => void;
  searchQuery?: string;
}

const Navbar = ({ onSearch, searchQuery = "" }: NavbarProps) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onSearch) {
      onSearch(e.target.value);
    }
  };


  return (
    <div className="w-full bg-primary py-2 px-4 md:px-6 font-inter">
      <div className="flex justify-between items-center">
        <div className="flex justify-center items-center">
          <img width={45} height={45} src="./logo.png" alt="logo-main" className="" />
          <img width={105} height={105} src="./logo-image.png" alt="logo" className="" />
        </div>

        <div className="hidden lg:flex relative w-2/5 bg-white rounded-md py-1">
          <div className="absolute left-1 top-1/2 -translate-y-1/2 text-gray-400 flex justify-center items-center border-r border-r-gray-300 px-2">
            <Search size={16} />
          </div>
        <input
            type="text"
            placeholder="Search for data and analytics"
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full pl-12 pr-3 py-1.5 rounded text-sm text-black outline-none"
          />
        </div>

        <div className="hidden md:flex justify-center items-center gap-4 lg:gap-7 text-white">
          <select className="bg-transparent text-sm lg:text-base">
            <option value="database">Database</option>
            <option value="data">Data</option>
          </select>
          <button className="text-sm lg:text-base">Calendar</button>
          <button className="text-sm lg:text-base">Help</button>

          {status === "authenticated" ? (
            <div className="relative group">
              <button className="flex justify-center items-center gap-2">
                <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full font-semibold bg-white flex items-center justify-center text-primary text-sm lg:text-base">
                  {session.user?.name?.slice(0, 1)}
                </div>
              </button>

              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 hidden group-hover:block z-50">
                <div className="px-4 py-2 text-sm text-gray-700 border-b">
                  {session.user?.email}
                </div>
                <button
                  onClick={() => signOut({ callbackUrl: "/login" })}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => router.push("/login")}
              className="flex justify-center items-center gap-2 text-sm lg:text-base"
            >
              <LogIn size={18} />
              <span className="hidden lg:inline">Login</span>
            </button>
          )}
        </div>

        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden text-white p-2"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <div className="lg:hidden mt-3 relative bg-white rounded-md py-1">
        <div className="absolute left-1 top-1/2 -translate-y-1/2 text-gray-400 flex justify-center items-center border-r border-r-gray-300 px-2">
          <Search size={16} />
        </div>
        <input
          type="text"
          placeholder="Search for data and analytics"
          value={searchQuery}
          onChange={handleSearchChange}
          className="w-full pl-12 pr-3 py-1.5 rounded text-sm text-black outline-none"
        />
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden mt-4 pb-4 space-y-4 text-white">
          <select className="w-full bg-white text-black rounded px-3 py-2">
            <option value="database">Database</option>
            <option value="data">Data</option>
          </select>
          
          <button className="w-full text-left px-3 py-2 hover:bg-white/10 rounded">
            Calendar
          </button>
          
          <button className="w-full text-left px-3 py-2 hover:bg-white/10 rounded">
            Help
          </button>

          {status === "authenticated" ? (
            <div className="space-y-2">
              <div className="flex items-center gap-3 px-3 py-2">
                <div className="w-10 h-10 rounded-full font-semibold bg-white flex items-center justify-center text-primary">
                  {session.user?.name?.slice(0, 1)}
                </div>
                <div className="flex-1">
                  <div className="font-semibold">{session.user?.name}</div>
                  <div className="text-sm text-gray-300">{session.user?.email}</div>
                </div>
              </div>
              <button
                onClick={() => {
                  signOut({ callbackUrl: "/login" });
                  setIsMobileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 hover:bg-white/10 rounded flex items-center gap-2"
              >
                <LogIn size={18} />
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                router.push("/login");
                setIsMobileMenuOpen(false);
              }}
              className="w-full flex items-center gap-2 px-3 py-2 bg-white text-primary rounded font-semibold"
            >
              <LogIn size={18} />
              Login
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Navbar;