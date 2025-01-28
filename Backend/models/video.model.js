import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
    videoUrl: { type: String, required: true, unique: true },
    summary: { type: String, required: true },
    questions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }],
}, { timestamps: true });

export const Video = mongoose.model('Video', videoSchema);