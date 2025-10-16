"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginValidation = exports.companyRegisterValidation = exports.userRegisterValidation = void 0;
const express_validator_1 = require("express-validator");
exports.userRegisterValidation = [
    (0, express_validator_1.body)("role")
        .equals("USER")
        .withMessage("Role must be USER for Job Seeker."),
    (0, express_validator_1.body)("name")
        .notEmpty()
        .withMessage("Name is required."),
    (0, express_validator_1.body)("email")
        .notEmpty()
        .withMessage("Email is required.")
        .isEmail()
        .withMessage("Invalid email format."),
    (0, express_validator_1.body)("password")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters long."),
    (0, express_validator_1.body)("confirmPassword").custom((value, { req }) => {
        if (value !== req.body.password)
            throw new Error("Passwords do not match.");
        return true;
    }),
];
exports.companyRegisterValidation = [
    (0, express_validator_1.body)("role")
        .equals("ADMIN")
        .withMessage("Role must be ADMIN for Company registration."),
    (0, express_validator_1.body)("name")
        .notEmpty()
        .withMessage("Company name is required."),
    // body("phone")
    //   .notEmpty()
    //   .withMessage("Phone number is required."),
    (0, express_validator_1.body)("email")
        .notEmpty()
        .withMessage("Email is required.")
        .isEmail()
        .withMessage("Invalid email format."),
    (0, express_validator_1.body)("password")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters long."),
    (0, express_validator_1.body)("confirmPassword").custom((value, { req }) => {
        if (value !== req.body.password)
            throw new Error("Passwords do not match.");
        return true;
    }),
];
exports.loginValidation = [
    (0, express_validator_1.body)("email")
        .notEmpty()
        .withMessage("Email is required.")
        .isEmail()
        .withMessage("Invalid email format."),
    (0, express_validator_1.body)("password").notEmpty().withMessage("Password is required."),
];
