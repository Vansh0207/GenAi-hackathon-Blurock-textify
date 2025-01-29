import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import { Loader2 } from "lucide-react";

const HistoryPage = () => {
    const navigate = useNavigate();
    const [history, setHistory] = useState([]); // To store the user’s videos and questions
    const [loading, setLoading] = useState(true); // To manage loading state
    const [selectedVideo, setSelectedVideo] = useState(null); // To store the selected video
    const selectedVideoRef = useRef(null);

    // Fetch the current user’s data and videos
    const { user } = useSelector(store => store.auth);

    useEffect(() => {
        if (!user?._id) return; // Ensure user._id exists

        const fetchUserData = async () => {
            try {
                // Log user ID to check if it's being passed correctly
                console.log("User ID:", user?._id);

                const response = await axios.get(`http://localhost:8000/api/user/userData/${user._id}`);
                console.log("API Response Data:", response.data); // Debugging API response

                // Check if the videos array is in the response and set it to state
                setHistory(Array.isArray(response.data.user.videos) ? response.data.user.videos : []);
            } catch (error) {
                console.error("Error fetching videos:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [user?._id]);

    // Handle video click to display full video details
    const handleVideoClick = (videoId) => {
        const selected = history.find((video) => video._id === videoId);
        setSelectedVideo(selected); // Store selected video to show details
    };

    // Handle adding a new video
    const handleAddNew = () => {
        navigate("/");
    };

    // Calculate total score of the user
    const totalScore = history.reduce((acc, video) => acc + (video.score || 0), 0);

    // Log history to ensure it's being set correctly
    useEffect(() => {
        console.log("History state:", history);
    }, [history]);

    useEffect(() => {
        if (selectedVideoRef.current) {
            setTimeout(() => {
                selectedVideoRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
            }, 100); // Delay to ensure the DOM is fully updated before scrolling
        }
    }, [selectedVideo]);
    
    const getCircleScore = () => {
        const percentage = (selectedVideo.score / selectedVideo.questions.length) * 100;
        return (
            <div className="relative flex items-center justify-center">
                <svg width="100" height="100" className="rotate-90">
                    <circle
                        cx="50"
                        cy="50"
                        r="45"
                        stroke="#e6e6e6"
                        strokeWidth="10"
                        fill="none"
                    />
                    <circle
                        cx="50"
                        cy="50"
                        r="45"
                        stroke="#4CAF50"
                        strokeWidth="10"
                        fill="none"
                        strokeDasharray={`${(percentage / 100) * (2 * Math.PI * 45)} ${2 * Math.PI * 45}`}
                        strokeDashoffset={(2 * Math.PI * 45) * (1 - percentage / 100)}
                        transform="rotate(-90 50 50)"
                    />
                </svg>
                <div className="absolute text-xl font-semibold">{selectedVideo.score}/{selectedVideo.questions.length}</div>
            </div>
        );
    };

    return (
        <div className="max-w-5xl min-h-[80vh] mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">History</h1>
                <button
                    onClick={handleAddNew}
                    className="bg-blue-500 text-white py-2 px-4 rounded-md shadow hover:bg-blue-600 transition"
                >
                    Add New +
                </button>
            </div>

            {/* Total Score Display */}
            <div className="mb-6 p-4 flex items-center justify-between bg-gray-200 rounded-lg text-center text-xl font-semibold">
                <div className="flex items-center justify-center gap-4">
                    <img src="coin_gif.webp" alt="Gold Coin" className="h-8 w-8" />
                    Total Points Earned: {totalScore}
                </div>
                <button className="bg-blue-500 text-white py-1.5 px-2.5 text-sm rounded-md shadow hover:bg-blue-600 transition cursor-pointer">Reedem Now</button>
            </div>

            {loading ? (
                <p className="min-w-full min-h-[80vh] flex items-center justify-center">
                    <Loader2 className="w-10 h-10" />
                </p>
            ) : (
                <>
                    {/* Display videos */}
                    {history.length === 0 ? (
                        <p>No videos found.</p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {history.map((video) => (
                                <div
                                    key={video._id}
                                    className={`border rounded-lg p-4 shadow hover:shadow-2xl cursor-pointer transition ${selectedVideo?._id === video._id ? 'shadow-2xl bg-gray-200' : ''
                                        }`}
                                    onClick={() => handleVideoClick(video._id)}
                                >
                                    <h2 className="text-xl font-semibold">{video.title}</h2>
                                    <p className="text-sm text-gray-600 mt-2 line-clamp-2">{video.summary}</p>
                                    <p className="text-sm text-gray-600 mt-2 line-clamp-2">{video.transcription}</p>
                                </div>
                            ))}
                        </div>
                    )}
                    {selectedVideo && (
                        <div ref={selectedVideoRef} className="mt-8 p-6 bg-gray-100 rounded-lg shadow-lg">
                            {/* Video Title */}
                            <h2 className="text-2xl font-bold text-gray-800">{selectedVideo.title}</h2>

                            {/* Summary & Transcription */}
                            <p className="mt-4 text-gray-700 leading-relaxed">{selectedVideo.summary}</p>
                            <p className="mt-4 text-gray-600 leading-relaxed italic">{selectedVideo.transcription}</p>

                            {/* Score Display */}
                            <div className="mt-6 flex items-center gap-2">
                                <span className="text-lg font-semibold text-gray-700">Score:</span>
                                <div className="text-black px-3 py-1 rounded-full text-sm font-medium">
                                    {getCircleScore()}
                                </div>
                            </div>

                            {/* Quiz Section */}
                            <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
                                <h3 className="text-xl font-semibold text-gray-800 mb-4">Quiz Questions</h3>
                                <ul className="space-y-6">
                                    {selectedVideo.questions?.map((question, index) => (
                                        <li key={index} className="bg-gray-50 p-4 rounded-lg border">
                                            {/* Question */}
                                            <p className="font-medium text-gray-900">{question.question}</p>

                                            {/* Options */}
                                            <ul className="mt-3 space-y-2">
                                                {question.options?.map((option, idx) => (
                                                    <li
                                                        key={idx}
                                                        className={`p-2 rounded-lg ${option === question.correctAns ? 'bg-green-100 text-green-700 font-semibold' : 'text-gray-700'
                                                            }`}
                                                    >
                                                        {option} {option === question.correctAns && '✅'}
                                                    </li>
                                                ))}
                                            </ul>

                                            {/* Correct Answer */}
                                            <div className="mt-3 flex items-center gap-2">
                                                <span className="font-semibold text-gray-800">Correct Answer:</span>
                                                <span className="bg-green-500 text-white px-3 py-1 rounded-md text-sm font-medium">
                                                    {question.correctAns}
                                                </span>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default HistoryPage;