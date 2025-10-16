"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyRole = void 0;
const verifyRole = (allowedRoles) => {
    return (req, res, next) => {
        try {
            const userRole = res.locals.decrypt.role;
            if (!userRole || !allowedRoles.includes(userRole)) {
                return res.status(401).json({
                    success: false,
                    message: "You are not authorized to access this resource",
                });
            }
            next();
        }
        catch (error) {
            next(error);
        }
    };
};
exports.verifyRole = verifyRole;
