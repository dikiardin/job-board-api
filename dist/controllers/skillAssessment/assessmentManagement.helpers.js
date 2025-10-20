"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateQuestionsArray = exports.validateSingleQuestion = void 0;
const validateSingleQuestion = (q, index) => {
    if (!q.question || !q.question.trim()) {
        return {
            valid: false,
            error: `Question ${index + 1}: Question text is required`,
        };
    }
    if (!Array.isArray(q.options) || q.options.length !== 4) {
        return {
            valid: false,
            error: `Question ${index + 1}: Must have exactly 4 options`,
        };
    }
    if (!q.answer || !q.answer.trim()) {
        return {
            valid: false,
            error: `Question ${index + 1}: Answer is required`,
        };
    }
    if (!q.options.includes(q.answer)) {
        return {
            valid: false,
            error: `Question ${index + 1}: Answer must be one of the options`,
        };
    }
    return { valid: true };
};
exports.validateSingleQuestion = validateSingleQuestion;
const validateQuestionsArray = (questions) => {
    for (let i = 0; i < questions.length; i++) {
        const question = questions[i];
        if (!question)
            continue; // Type guard
        const result = (0, exports.validateSingleQuestion)(question, i);
        if (!result.valid) {
            return result;
        }
    }
    return { valid: true };
};
exports.validateQuestionsArray = validateQuestionsArray;
