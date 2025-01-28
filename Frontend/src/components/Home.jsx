import { useState } from "react";
import { Link } from "react-router-dom";

export default function Home() {

    return (
        <div className="bg-[#0B1930] min-h-[90vh] flex flex-col items-center justify-center text-white p-4">
            {/* Title & Subtitle */}
            <div className="text-center">
                <h1 className="text-3xl md:text-4xl font-extrabold my-6">
                    Transform YouTube videos into interactive quizzes and insightful summaries.
                </h1>
                <p className="mt-2 text-lg md:text-xl text-gray-300 my-6">
                    Transform YouTube videos or audio into engaging quizzes and summaries, providing your audience with an interactive learning experience. Easily build, edit, and track the content through the platform.
                </p>
            </div>

            {/* Input Box Section */}
            <div className="bg-white text-gray-900 w-full max-w-xl mt-6 p-6 rounded-2xl shadow-lg">
                <h2 className="text-md font-bold">Turn YouTube videos or audio into quizzes and summaries.</h2>
                <p className="text-gray-500 text-sm">No credit card required.</p>

                {/* Input Box */}
                <div className="py-4 bg-white rounded-lg shadow-md">
                    <label className="block text-lg font-semibold text-gray-800 mb-2">Upload Audio/Video here:</label>
                    <input type="file" id="audioFile" accept="audio/*,video/*" className="w-full text-sm text-gray-700 bg-gray-100 border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300 hover:bg-gray-200" />
                </div>

                <Link to="/result">
                    <button className="w-full mt-4 bg-blue-600 text-white py-3 rounded-lg font-bold text-lg flex items-center justify-center space-x-2 hover:bg-blue-700">
                        Get your Quiz/Summary for free →
                    </button>
                </Link>
            </div>
        </div>
    );
}
