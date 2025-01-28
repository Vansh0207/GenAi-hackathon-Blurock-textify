import { User } from "../models/user.model.js";
import { Video } from "../models/video.model.js";
import { Question } from "../models/question.model.js";

export const saveQuestion = async (req, res) => {
    try {
        const { quizQuestions, videoId } = req.body;
        const userId = req.id;

        // Step 1: Save questions in the Question model
        const questions = await Question.insertMany(quizQuestions);

        // Step 2: Update the Video model by linking the saved questions
        const video = await Video.findByIdAndUpdate(
            videoId,
            { $push: { questions: { $each: questions.map(q => q._id) } } },
            { new: true }
        );

        // Step 3: Update the User model by linking the video
        const user = await User.findByIdAndUpdate(
            userId,
            { $push: { videos: video._id } },
            { new: true }
        );

        res.status(200).json({
            success: true,
            message: 'Quiz questions saved successfully.',
            videoId: video._id,
            userId: user._id,
        });
    } catch (error) {
        console.error('Error saving quiz:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to save quiz.',
        });
    }
};
