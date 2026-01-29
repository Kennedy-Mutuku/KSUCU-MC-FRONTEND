import React from "react";
import { useNavigate } from "react-router-dom";

const EventHeader: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="relative w-full">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-purple-500 to-blue-600 opacity-95"></div>

      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-white opacity-5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl"></div>

      {/* Header Content */}
      <div className="relative z-10 px-6 md:px-12 py-16 md:py-20">
        <div className="flex items-center justify-between gap-8 max-w-7xl mx-auto">
          {/* Logo Section - Left */}
          <div className="flex-shrink-0 hidden md:flex">
            <div className="w-20 h-20 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white border-opacity-30 hover:bg-opacity-30 transition-all duration-300">
              <svg
                className="w-12 h-12 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 6v6m0 0v6m0-6h6m0 0h6m-6-6h-6m0 0H0"
                />
              </svg>
            </div>
          </div>

          {/* Center Title Section */}
          <div className="flex-1 text-center px-4">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white drop-shadow-lg tracking-wide leading-tight mb-2 animate-fade-in">
              KISII UNIVERSITY
            </h1>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-blue-100 drop-shadow-md tracking-wider">
              CHRISTIAN UNION
            </h2>
            <div className="h-1 w-24 bg-gradient-to-r from-transparent via-white to-transparent mx-auto mt-4 opacity-60"></div>
          </div>

          {/* Buttons Section - Right */}
          <div className="flex-shrink-0 flex gap-3 md:gap-4">
            {/* About Us Button */}
            <button
              onClick={() => navigate("/about")}
              className="px-6 md:px-8 py-3 md:py-4 bg-white bg-opacity-20 hover:bg-opacity-30 text-white font-semibold rounded-full backdrop-blur-md border border-white border-opacity-40 hover:border-opacity-60 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-sm md:text-base whitespace-nowrap"
            >
              About us
            </button>

            {/* Log In Button */}
            <button
              onClick={() => navigate("/signin")}
              className="px-6 md:px-8 py-3 md:py-4 bg-white text-purple-600 font-bold rounded-full hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl text-sm md:text-base whitespace-nowrap"
            >
              Log In
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Wave Decoration */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white to-transparent opacity-20"></div>
    </div>
  );
};

export default EventHeader;
