"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestionManagementController = void 0;
const controllerHelper_1 = require("../../utils/controllerHelper");
class QuestionManagementController {
    static async saveQuestion(req, res, next) {
        try {
            const { userId, role } = res.locals.decrypt;
            const { assessmentId, question, options, answer } = req.body;
            QuestionManagementController.validateQuestionData(assessmentId, question, options, answer);
            // For now, return success - this would integrate with AssessmentCreationService
            const result = { id: Date.now(), assessmentId, question, options, answer };
            res.status(201).json({
                success: true,
                message: "Question saved successfully",
                data: result,
            });
        }
        catch (error) {
            next(error);
        }
    }
    static validateQuestionData(assessmentId, question, options, answer) {
        controllerHelper_1.ControllerHelper.validateRequired({ assessmentId, question, options, answer }, "Assessment ID, question, options, and answer are required");
        if (!Array.isArray(options) || options.length !== 4) {
            throw new Error("Options must be an array of 4 items");
        }
        if (!options.includes(answer)) {
            throw new Error("Answer must be one of the provided options");
        }
    }
}
exports.QuestionManagementController = QuestionManagementController;
//# sourceMappingURL=questionManagement.controller.js.map