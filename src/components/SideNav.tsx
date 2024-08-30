"use client";
import React from "react";
import { FaHome } from "react-icons/fa";
import CreateSubreddit from "./subreddit/AddSubreddit";

function SideNav() {
  return (
    <div className="h-full w-64 bg-gray-800 text-white shadow-lg p-4">
      <nav>
        <ul>
          <li className="mb-4">
            <a href="/" className="flex items-center space-x-2">
              <FaHome />
              <span>Home</span>
            </a>
          </li>
          <li>
            <CreateSubreddit />
          </li>
          {/* Add more links here as needed */}
        </ul>
      </nav>
    </div>
  );
}

export default SideNav;
