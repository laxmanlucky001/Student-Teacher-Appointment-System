import React from "react";
import { FaCalendarAlt, FaChalkboardTeacher, FaUserGraduate } from "react-icons/fa";
import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <div
      className="min-h-screen absolute inset-0 z-0 bg-gradient-to-b from-blue-100 to-white flex flex-col"
      style={{
        backgroundImage: 'url("https://img.freepik.com/free-photo/abstract-luxury-gradient-blue-background-smooth-dark-blue-with-black-vignette-studio-banner_1258-63450.jpg?semt=ais_hybrid")', width:'100%',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 z-0 w-full max-w-[1197px] px-4 py-16 mx-auto">
        {/* Hero Section */}
        <header className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4 text-blue-800 drop-shadow-lg">
            Welcome to EduConnect
          </h1>
          <p className="text-xl text-gray-700 mb-8">
            Streamline your educational appointments with ease
          </p>
          <div className="flex justify-center space-x-4">
            <Link
              to="/register"
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-full shadow-lg transition duration-300"
            >
              Sign Up
            </Link>
            <Link
              to="/login"
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-full shadow-lg transition duration-300"
            >
              Log In
            </Link>
          </div>
        </header>

        {/* Features Section */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-8 rounded-lg shadow-md text-center transition-transform transform hover:scale-105">
            <FaUserGraduate className="text-5xl text-blue-500 mb-4 mx-auto" />
            <h2 className="text-2xl font-semibold mb-4">For Students</h2>
            <ul className="text-gray-600 space-y-2">
              <li>Book appointments with teachers</li>
              <li>Manage your schedule</li>
              <li>Receive notifications</li>
            </ul>
          </div>
          <div className="bg-white p-8 rounded-lg shadow-md text-center transition-transform transform hover:scale-105">
            <FaChalkboardTeacher className="text-5xl text-green-500 mb-4 mx-auto" />
            <h2 className="text-2xl font-semibold mb-4">For Teachers</h2>
            <ul className="text-gray-600 space-y-2">
              <li>Manage available slots</li>
              <li>Approve or reject appointments</li>
              <li>Communicate with students</li>
            </ul>
          </div>
          <div className="bg-white p-8 rounded-lg shadow-md text-center transition-transform transform hover:scale-105">
            <FaCalendarAlt className="text-5xl text-purple-500 mb-4 mx-auto" />
            <h2 className="text-2xl font-semibold mb-4">Features</h2>
            <ul className="text-gray-600 space-y-2">
              <li>Real-time booking</li>
              <li>Mobile compatibility</li>
              <li>Secure and user-friendly</li>
            </ul>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="text-center">
          <h2 className="text-3xl font-bold mb-4">Get Started Today</h2>
          <p className="text-xl text-gray-600 mb-8">
            Join EduConnect and experience a new way of managing educational appointments.
          </p>
          <Link
            to="/register"
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-full shadow-lg transition duration-300"
          >
            Create Your Account
          </Link>
        </section>
      </div>
    </div>
  );
};

export default LandingPage;
