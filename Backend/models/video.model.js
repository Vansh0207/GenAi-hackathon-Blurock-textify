import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
    videoUrl: { type: String, required: true, unique: true },
    transcription: { type: String, required: false },
    summary: { type: String, default: "Default summary" },
    questions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }],
}, { timestamps: true });

export const Video = mongoose.model('Video', videoSchema);