import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";

const HistoryPage = () => {
    const navigate = useNavigate();
    const [history, setHistory] = useState([]); // To store the user’s videos and questions
    const [loading, setLoading] = useState(true); // To manage loading state
    const [selectedVideo, setSelectedVideo] = useState(null); // To store the selected video

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

    // Log history to ensure it's being set correctly
    useEffect(() => {
        console.log("History state:", history);
    }, [history]);

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

            {loading ? (
                <p>Loading videos...</p>
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
                                    className="border rounded-lg p-4 shadow hover:shadow-md cursor-pointer transition"
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
                        <div className="mt-8 p-6 bg-gray-100 rounded-lg">
                            <h2 className="text-2xl font-bold">{selectedVideo.title}</h2>
                            <p className="mt-4">{selectedVideo.summary}</p>
                            <p className="mt-4">{selectedVideo.transcription}</p>

                            {/* Display quiz questions */}
                            <div className="mt-6">
                                <h3 className="text-xl font-semibold">Quiz Questions</h3>
                                <ul className="list-disc pl-6 mt-4">
                                    {selectedVideo.questions?.map((question, index) => (
                                        <li key={index} className="my-5">
                                            <strong>{question.question}</strong>
                                            <ul className="list-inside mt-2">
                                                {question.options?.map((option, idx) => (
                                                    <li key={idx}>
                                                        {option} {option === question.correctAns && "(Correct)"}
                                                    </li>
                                                ))}
                                            </ul>
                                            <div className="flex items-center gap-1">
                                                <p className="font-bold">Correct Ans: </p>
                                                <p className="text-green-700">{question.correctAns}</p>
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