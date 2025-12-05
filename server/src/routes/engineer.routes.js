import { Router } from "express";
import {
    RegisterEngineer,
    LoginEngineer,
    logoutUser,
} from "../controllers/Engineer.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();


router.post("/register", RegisterEngineer);
router.post("/login", LoginEngineer);



router.post("/logout",verifyJWT, logoutUser);

export default router;
