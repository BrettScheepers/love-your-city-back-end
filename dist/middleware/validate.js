"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function validToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (token === null)
        return res.json({ msg: "null token" });
    jsonwebtoken_1.default.verify(token, process.env.ACCESS_TOKEN, (error, user) => {
        if (error)
            return res.json({ error: error.message });
        req.user = user;
        next();
    });
}
exports.validToken = validToken;
