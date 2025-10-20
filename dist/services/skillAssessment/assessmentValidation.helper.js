"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validatePassScore = exports.validateQuestions = void 0;
const customError_1 = require("../../utils/customError");
const MIN_QUESTIONS_COUNT = 1;
const MIN_PASS_SCORE = 1;
const MAX_PASS_SCORE = 100;
const REQUIRED_OPTIONS_COUNT = 4;
const validateQuestions = (questions) => {
    if (questions.length < MIN_QUESTIONS_COUNT) {
        throw new customError_1.CustomError("Assessment must have at least 1 question", 400);
    }
    questions.forEach((q, index) => {
        if (!q.question?.trim()) {
            throw new customError_1.CustomError(`Question ${index + 1} text is required`, 400);
        }
        if (!Array.isArray(q.options) ||
            q.options.length !== REQUIRED_OPTIONS_COUNT) {
            throw new customError_1.CustomError(`Question ${index + 1} must have exactly 4 options`, 400);
        }
        if (q.options.some((option) => !option?.trim())) {
            throw new customError_1.CustomError(`Question ${index + 1} options cannot be empty`, 400);
        }
        if (!q.answer?.trim()) {
            throw new customError_1.CustomError(`Question ${index + 1} answer is required`, 400);
        }
        if (!q.options.includes(q.answer)) {
            throw new customError_1.CustomError(`Question ${index + 1} answer must be one of the provided options`, 400);
        }
    });
};
exports.validateQuestions = validateQuestions;
const validatePassScore = (passScore) => {
    if (passScore !== undefined && passScore !== null) {
        if (typeof passScore !== "number") {
            throw new customError_1.CustomError("Pass score must be a number", 400);
        }
        if (passScore < MIN_PASS_SCORE || passScore > MAX_PASS_SCORE) {
            throw new customError_1.CustomError("Pass score must be between 1% and 100%", 400);
        }
        if (!Number.isInteger(passScore)) {
            throw new customError_1.CustomError("Pass score must be a whole number", 400);
        }
    }
};
exports.validatePassScore = validatePassScore;
