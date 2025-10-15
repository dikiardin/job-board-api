"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.transport = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
exports.transport = nodemailer_1.default.createTransport({
    service: "gmail",
    auth: {
        user: process.env.MAIL_SENDER,
        pass: process.env.MAIL_PASSWORD,
    },
});
//# sourceMappingURL=nodemailer.js.map