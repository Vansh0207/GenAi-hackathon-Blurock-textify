import express from "express";
import { saveQuestion } from "../controllers/quiz.controller.js";
import Authenticated from "../middlewares/Authenticated.js";

const router = express.Router();

router.route('/saveQuestion').post(Authenticated, saveQuestion);

export default router;