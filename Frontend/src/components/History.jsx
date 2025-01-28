import React from "react";
import { useNavigate } from "react-router-dom";

// Utility function to extract YouTube video ID from URL
const getYouTubeThumbnail = (url) => {
    const match = url.match(/[?&]v=([^&]+)/);
    return match ? "https://img.youtube.com/vi/${match[1]}/hqdefault.jpg" : null;
};

const HistoryPage = () => {
    const navigate = useNavigate();

    // Dummy data for the history (replace with actual data from backend)
    const history = [
        {
            id: 1,
            title: "React Basics",
            videoUrl: "https://www.youtube.com/watch?v=vIyU4nInlt0&t=4717s", // Example YouTube URL
            summary: "Learn the basics of React.js, including components and hooks.",
        },
        {
            id: 2,
            title: "JavaScript ES6 Features",
            videoUrl: "https://www.youtube.com/watch?v=vIyU4nInlt0&t=4717s", // Example YouTube URL
            summary: "Deep dive into ES6 features like arrow functions, promises, and more.",
        },
    ];

    // Navigate to the quiz page or details page for a specific video
    const handleVideoClick = (videoId) => {
        navigate(`/video/${videoId}`); // Navigate to a dynamic page
    };

    // Navigate to the "Add New Video" page
    const handleAddNew = () => {
        navigate("/add-video");
    };

    return (
        <div className="max-w-5xl mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">History</h1>
                <button
                    onClick={handleAddNew}
                    className="bg-blue-500 text-white py-2 px-4 rounded-md shadow hover:bg-blue-600 transition"
                >
                    Add New +
                </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {history.map((video) => (
                    <div
                        key={video.id}
                        className="border rounded-lg p-4 shadow hover:shadow-md cursor-pointer transition"
                        onClick={() => handleVideoClick(video.id)}
                    >
                        {/* Get the YouTube thumbnail using the utility function */}
                        <img
                            src={getYouTubeThumbnail(video.videoUrl)}
                            alt={video.title}
                            className="w-full h-40 object-cover rounded-md mb-4"
                        />
                        <h2 className="text-xl font-semibold">{video.title}</h2>
                        <p className="text-sm text-gray-600 mt-2">{video.summary}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HistoryPage;