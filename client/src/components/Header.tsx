import React from "react";

export default function Header() {
  return (
    <header className="border-b">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo / Blog name */}
        <h1 className="text-xl font-bold cursor-pointer">SoulTree</h1>

        {/* Navigation */}
        <nav className="space-x-6 text-gray-600">
          <a href="#" className="hover:text-black">
            Home
          </a>
          <a href="#" className="hover:text-black">
            Blog
          </a>
          <a href="#" className="hover:text-black">
            Dashbroad
          </a>
          <a href="#" className="hover:text-black">
            About
          </a>
        </nav>
      </div>
    </header>
  );
}
