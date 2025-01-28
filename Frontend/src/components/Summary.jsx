import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const SummaryPage = () => {
    const { id } = useParams(); // Get the video ID from the URL parameter
    const [videoDetails, setVideoDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch video details from the backend
        const fetchVideoDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/video/summary/${id}`, {
                    withCredentials: true, // Send cookies with request
                });
                if (response.data.success) {
                    setVideoDetails(response.data.video);
                } else {
                    alert("Failed to fetch video details.");
                }
            } catch (error) {
                console.error("Error fetching video details:", error);
                alert("An error occurred while fetching video details.");
            } finally {
                setLoading(false);
            }
        };

        fetchVideoDetails();
    }, [id]);

    const handleGenerateQuiz = async () => {
        try {
            setLoading(true);
    
            // Get the transcription text
            const transcription = videoDetails.transcription;
    
            // Send request to Python backend
            const response = await axios.post(
                'http://127.0.0.1:5000/modify',
                { modification_input: 'give me the 5 quiz questions from the text in json format as question as string, options as array of objects, correctAns as string', transcription },
                { headers: { 'Content-Type': 'application/json' } }
            );
    
            const modifiedText = response.data.modified_text;
            console.log("Modified Text:", modifiedText);
    
            // Parse and map quiz questions to match the schema
            const quizQuestions = JSON.parse(modifiedText).map(q => ({
                question: q.question,
                options: q.options,
                correctAns: q.correct,
            }));
    
            console.log("Quiz Questions:", quizQuestions);
    
            // Send to Node.js backend
            const saveQuizResponse = await axios.post(
                'http://localhost:8000/api/question/saveQuestion',
                {
                    quizQuestions,
                    videoId: videoDetails._id,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                    withCredentials: true, // Send cookies with request
                }
            );
    
            if (saveQuizResponse.data.success) {
                alert('Quiz generated successfully!');
                navigate(`/quiz-summary/${saveQuizResponse.data.quizId}`);
            } else {
                alert('Failed to save quiz.');
            }
        } catch (error) {
            console.error('Error generating quiz:', error);
            alert('An error occurred while generating the quiz.');
        } finally {
            setLoading(false);
        }
    };    

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!videoDetails) {
        return <div>No video details found.</div>;
    }

    return (
        <div className="max-w-4xl mx-auto p-6 bg-gray-50">
            <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Video Summary</h1>
            <div>
                <h2 className="text-2xl font-semibold text-blue-600 mb-4">{videoDetails.title}</h2>
                <p className="text-gray-700 text-lg mb-4">{videoDetails.summary}</p>
                <p className="text-gray-600 text-base mb-6">{videoDetails.transcription}</p>
                <button
                    className="bg-green-500 text-white py-3 px-6 text-lg font-semibold rounded-md hover:bg-green-600 transition duration-300"
                    onClick={handleGenerateQuiz}
                >
                    Generate Quiz
                </button>
            </div>
        </div>
    );
};

export default SummaryPage;
