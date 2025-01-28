import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const QuizPage = () => {
    const { id } = useParams();
    const [questions, setQuestions] = useState([]);
    const [submitted, setSubmitted] = useState(false);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedOptions, setSelectedOptions] = useState([]); // Array to store selected options

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/question/${id}/questions`);
                setQuestions(response.data.questions);
            } catch (error) {
                console.error("Error fetching questions:", error.message);
            }
        };

        fetchQuestions();
    }, [videoId]);

    const handleOptionSelect = (option) => {
        const updatedOptions = [...selectedOptions];
        updatedOptions[currentQuestionIndex] = option; // Update the option for the current question
        setSelectedOptions(updatedOptions);
    };

    const handleNext = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    };

    const handlePrevious = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    };

    const handleSubmit = () => {
        setSubmitted(true);
        console.log("Submitted Answers:", selectedOptions); // Log the selected options
        // Send selectedOptions to the backend here if needed
    };

    const currentQuestion = questions[currentQuestionIndex];

    return (
        <div className="max-w-4xl mx-auto p-6 bg-gray-50">
            <h1 className="text-3xl font-bold text-center mb-6">Quiz</h1>
            {!submitted ? (
                <div>
                    {currentQuestion ? (
                        <>
                            <h2 className="text-xl font-semibold mb-4">{`Q${currentQuestionIndex + 1}. ${currentQuestion.question}`}</h2>
                            <div className="space-y-3">
                                {currentQuestion.options.map((option, index) => (
                                    <div key={index}>
                                        <label className="flex items-center space-x-2">
                                            <input
                                                type="radio"
                                                name={`question-${currentQuestionIndex}`}
                                                value={option}
                                                checked={selectedOptions[currentQuestionIndex] === option}
                                                onChange={() => handleOptionSelect(option)}
                                                className="cursor-pointer"
                                            />
                                            <span>{option}</span>
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        <p>Loading questions...</p>
                    )}
                    <div className="flex justify-between mt-6">
                        <button
                            className="bg-blue-500 text-white py-2 px-4 rounded-md"
                            onClick={handlePrevious}
                            disabled={currentQuestionIndex === 0}
                        >
                            Previous
                        </button>
                        {currentQuestionIndex === questions.length - 1 ? (
                            <button
                                className="bg-green-500 text-white py-2 px-4 rounded-md"
                                onClick={handleSubmit}
                            >
                                Submit
                            </button>
                        ) : (
                            <button
                                className="bg-blue-500 text-white py-2 px-4 rounded-md"
                                onClick={handleNext}
                            >
                                Next
                            </button>
                        )}
                    </div>
                </div>
            ) : (
                <div className="text-center">
                    <h2 className="text-2xl font-bold">Quiz Completed!</h2>
                    <p className="text-lg mt-4">Your Answers:</p>
                    <ul className="list-disc list-inside mt-4">
                        {questions.map((question, index) => (
                            <li key={index}>
                                <strong>Q{index + 1}:</strong> {selectedOptions[index] || "No Answer Selected"}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default QuizPage;