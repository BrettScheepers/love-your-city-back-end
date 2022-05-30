"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.token = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
function token({ user_id, username, email }) {
    const user = { user_id, username, email };
    return jsonwebtoken_1.default.sign(user, process.env.ACCESS_TOKEN, {
        expiresIn: "20h",
    });
}
exports.token = token;
