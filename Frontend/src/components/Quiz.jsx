import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Loader2 } from "lucide-react";

const QuizPage = () => {
    const { id } = useParams(); // The videoId
    const [questions, setQuestions] = useState([]);
    const [submitted, setSubmitted] = useState(false);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [score, setScore] = useState(0);

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/question/${id}/questions`);
                setQuestions(response.data.questions);
                setSelectedOptions(new Array(response.data.questions.length).fill(''));
            } catch (error) {
                console.error("Error fetching questions:", error.message);
            }
        };

        fetchQuestions();
    }, [id]);

    const handleOptionSelect = (index, option) => {
        const updatedOptions = [...selectedOptions]; // Copy the current selected options

        // Map index to corresponding letter (A for 0, B for 1, C for 2, etc.)
        // const letter = String.fromCharCode(65 + index); // 65 is the ASCII code for 'A'

        // Now update the selectedOptions with the letter-based format
        updatedOptions[currentQuestionIndex] = `${option}`; // Store as A. Option, B. Option, etc.

        setSelectedOptions(updatedOptions); // Update the selectedOptions array
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

    const handleSubmit = async () => {
        let calculatedScore = 0;
        console.log("selected", selectedOptions);
        console.log("object", questions);


        questions.forEach((question, index) => {
            console.log(`Q${index + 1}: Correct Answer = ${question.correctAns}, Selected Option = ${selectedOptions[index]}`);

            if (selectedOptions[index] === question.correctAns[0]) {
                calculatedScore++;
            }
        });

        setScore(calculatedScore);
        setSubmitted(true);

        try {
            const response = await axios.post(`http://localhost:8000/api/video/${id}/score`, {
                videoId: id,
                score: calculatedScore,
            });
            console.log("Score saved successfully:", response.data);
        } catch (error) {
            console.error("Error saving score:", error.message);
        }
    };

    const currentQuestion = questions[currentQuestionIndex];

    // Function to generate circular progress
    const getCircleScore = () => {
        const percentage = (score / questions.length) * 100;
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
                        strokeDasharray={`${(percentage / 100) * (2 * Math.PI * 45)} ${2 * Math.PI * 45}`} // Update this line for proper calculation
                        strokeDashoffset={(2 * Math.PI * 45) * (1 - percentage / 100)} // This ensures it starts from top (0 degrees)
                        transform="rotate(-90 50 50)"
                    />
                </svg>
                <div className="absolute text-xl font-semibold">{score}/{questions.length}</div>
            </div>
        );
    };

    return (
        <div className="max-w-4xl min-h-[80vh] mx-auto p-6 bg-gray-50">
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
                                                checked={selectedOptions[currentQuestionIndex] === `${option}`}
                                                onChange={() => handleOptionSelect(index, option)} // Pass index and option
                                                className="cursor-pointer"
                                            />
                                            <span>{option}</span> {/* Display the name of the option */}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        <p className="min-w-full min-h-[80vh] flex items-center justify-center">
                            <Loader2 className="w-10 h-10" />
                        </p>
                    )}
                    <div className="flex justify-between mt-6">
                        <button
                            className="bg-blue-500 text-white py-2 px-4 rounded-md"
                            onClick={handlePrevious}
                            disabled={currentQuestionIndex === 0 || submitted}
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
                    <p className="text-lg mt-4">Your Score:</p>
                    <div className="mt-4">{getCircleScore()}</div>
                    <ul className="list-disc list-inside mt-4">
                        {questions.map((question, index) => (
                            <li key={index}>
                                <strong>Q{index + 1}:</strong> {selectedOptions[index] || "No Answer Selected"}{" "}
                                {selectedOptions[index] === question.correctAns[0] ? (
                                    <span className="text-green-500">✔️ Correct</span>
                                ) : (
                                    <span className="text-red-500">❌ Incorrect</span>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default QuizPage;