import { Router } from "express";
import {
    getAllUsersController
} from "../controllers/user.controller.js";
import { check, login, logout } from "../middlewares/auth.middleware.js"

const router = Router();

router.route('/').get(login);
router.route('/check').get(check);
router.route('/logout').get(logout);

export default router;
