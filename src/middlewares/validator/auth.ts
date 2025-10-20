import { body } from "express-validator";

export const userRegisterValidation = [
  body("role")
    .equals("USER")
    .withMessage("Role must be USER for Job Seeker."),

  body("name")
    .notEmpty()
    .withMessage("Name is required."),

  body("email")
    .notEmpty()
    .withMessage("Email is required.")
    .isEmail()
    .withMessage("Invalid email format."),

  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long."),

  body("confirmPassword").custom((value, { req }) => {
    if (value !== req.body.password) throw new Error("Passwords do not match.");
    return true;
  }),
];

export const companyRegisterValidation = [
  body("role")
    .equals("ADMIN")
    .withMessage("Role must be ADMIN for Company registration."),

  body("name")
    .notEmpty()
    .withMessage("Company name is required."),

  // body("phone")
  //   .notEmpty()
  //   .withMessage("Phone number is required."),

  body("email")
    .notEmpty()
    .withMessage("Email is required.")
    .isEmail()
    .withMessage("Invalid email format."),

  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long."),

  body("confirmPassword").custom((value, { req }) => {
    if (value !== req.body.password) throw new Error("Passwords do not match.");
    return true;
  }),
];

export const loginValidation = [
  body("email")
    .notEmpty()
    .withMessage("Email is required.")
    .isEmail()
    .withMessage("Invalid email format."),

  body("password").notEmpty().withMessage("Password is required."),
];
