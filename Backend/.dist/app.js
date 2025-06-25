"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const rout_users_1 = __importDefault(require("./routers/rout_users"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
dotenv_1.default.config();
const app = (0, express_1.default)();
async function Start() {
    try {
        await mongoose_1.default.connect('mongodb://localhost:27017/Picture_editor');
        console.log('✅ DB connected');
    }
    catch (e) {
        console.error('❌ Can’t access DB');
        throw new Error('Can not access to DB');
    }
}
Start();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use('/users', rout_users_1.default);
app.listen(process.env.PORT, () => {
    console.log(`App listens on ${process.env.APP}`);
});
