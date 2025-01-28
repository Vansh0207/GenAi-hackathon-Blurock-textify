import { User } from "../models/user.model.js";
import { Video } from "../models/video.model.js";
import getDataUri from "../utils/dataUri.js";
import cloudinary from "../utils/cloudinary.js";

export const uploadVideo = async (req, res) => {
    try {
        const userId = req.id;
        const video = req.file;

        if (!video) {
            return res.status(400).json({
                message: 'No video file uploaded.',
                success: false
            });
        }

        // Upload the video to Cloudinary
        const fileUri = getDataUri(video);
        const cloudResponse = await cloudinary.uploader.upload(fileUri, {
            resource_type: "video", // Specify the resource type as video
        });

        // Create a new Video document
        const newVideo = new Video({
            videoUrl: cloudResponse.secure_url,
            summary: "Default summary", // Replace with actual summary if available
        });

        // Save the new Video document to the database
        await newVideo.save();

        // Find the user and add the new video's ID to their videos array
        const user = await User.findById(userId).select('-password');
        if (!user) {
            return res.status(404).json({
                message: 'User not found.',
                success: false
            });
        }

        user.videos = user.videos || []; // Ensure videos is an array
        user.videos.push(newVideo._id); // Push the new video's ID to the user's videos array

        // Save the updated user document
        await user.save();

        return res.status(200).json({
            message: 'Video uploaded successfully.',
            success: true,
            video: newVideo, // Return the new video object
            user, // Return the updated user object
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Failed to upload video.',
            success: false,
        });
    }
};

export const uploadTranscription = async (req, res) => {
    try {
        const userId = req.id; // User ID from request
        const { videoId, transcription } = req.body; // Destructure transcription and videoId from request body

        if (!transcription) {
            return res.status(400).json({
                message: 'Transcription missing.',
                success: false,
            });
        }
        if (!videoId) {
            return res.status(400).json({
                message: 'Video ID missing.',
                success: false,
            });
        }

        // Find the user and check if the video exists in their videos array
        const user = await User.findById(userId).select('-password').populate('videos');
        if (!user) {
            return res.status(404).json({
                message: 'User not found.',
                success: false,
            });
        }

        // Find the video in the user's videos array
        const video = await Video.findById(videoId);
        if (!video) {
            return res.status(404).json({
                message: 'Video not found.',
                success: false,
            });
        }

        // Update the video's summary with the transcription
        video.transcription = transcription;

        // Save the updated video document
        await video.save();

        return res.status(200).json({
            message: 'Transcription updated successfully.',
            success: true,
            video, // Return the updated video object
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Failed to update transcription.',
            success: false,
        });
    }
};