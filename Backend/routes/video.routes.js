import express from "express";
import { uploadVideo, uploadTranscription } from "../controllers/video.controller.js";
import Authenticated from "../middlewares/Authenticated.js";
import upload from "../middlewares/multer.js";

const router = express.Router();

// Add multer middleware for file upload in uploadVideo route
router.route('/uploadVideo').post(Authenticated, upload.single('file'), uploadVideo);

// Route for uploading transcription
router.route('/uploadTranscription').post(Authenticated, uploadTranscription);

export default router;