import { Router } from "express";
import {
    RegisterEngineer,
    LoginEngineer,
    logoutUser,
} from "../controllers/Engineer.controller.js";

const router = Router();


router.post("/register", RegisterEngineer);
router.post("/login", LoginEngineer);



router.post("/logout", logoutUser);

export default router;
