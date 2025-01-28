import { User } from "../models/user.model.js";
import { Video } from "../models/video.model.js";
import { Question } from "../models/question.model.js";

export const saveQuestion = async (req, res) => {
    try {
        const { quizQuestions, videoId } = req.body;

        console.log("Received Quiz Questions:", quizQuestions);

        // Transform the incoming quiz questions to match the schema
        const transformedQuestions = quizQuestions.map((question) => {
            // Ensure each question has the correctAns field
            return {
                question: question.question,
                options: question.options,  // Map options directly
                correctAns: question.correct_answer,  // Rename correct_answer to correctAns
            };
        });

        console.log("Transformed Questions:", transformedQuestions);

        // Insert transformed questions into the database
        const questions = await Question.insertMany(transformedQuestions);

        // Find the video and update with the new questions
        const video = await Video.findByIdAndUpdate(
            videoId,
            { $push: { questions: { $each: questions.map(q => q._id) } } },
            { new: true }
        );

        if (!video) {
            return res.status(404).json({
                success: false,
                message: "Video not found.",
            });
        }

        // Return success response
        res.status(200).json({
            success: true,
            message: "Quiz questions saved successfully.",
            videoId: video._id,
        });
    } catch (error) {
        console.error("Error saving quiz:", error.message);
        res.status(500).json({
            success: false,
            message: "Failed to save quiz.",
            error: error.message,
        });
    }
};