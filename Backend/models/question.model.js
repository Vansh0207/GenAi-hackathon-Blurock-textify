import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
    question: { type: String, required: true},
    options: [{ type: String, required: true }],
    correctAns: [{ type: String, required: true }], // Change to array of strings
    videoId: { type: mongoose.Schema.Types.ObjectId, ref: "Video" },
}, { timestamps: true });

export const Question = mongoose.model('Question', questionSchema);