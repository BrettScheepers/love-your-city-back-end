"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
const token_1 = require("../lib/token");
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const router = express_1.default.Router();
const prisma = new client_1.PrismaClient();
router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { email, password } = req.body;
        const user = yield prisma.users.findUnique({
            where: {
                email: email,
            },
        });
        if (!user)
            throw new Error('User not found. Please retry with a correct email address.');
        if (!(yield bcrypt_1.default.compare(password, user.password)))
            throw new Error('Incorrect password. Please retry with a correct password.');
        return res.status(200).json({
            acessToken: (0, token_1.token)({
                user_id: user.user_id,
                username: user.username,
                email: user.email,
            }),
            user: {
                user_id: user.user_id,
                username: user.username,
                email: user.email,
            }
        });
    }
    catch (err) {
        if (err.message.includes("User not found") || err.message.includes("Incorrect password"))
            return res.status(400).json({ error: err.message });
        return res.status(500).json({ error: "Error occured. Please try again later." });
    }
}));
exports.default = router;
