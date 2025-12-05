import { Router } from "express";
import {
    registerAdmin,
    loginAdmin,
    logoutAdmin,
    getAllIssues,
    getAllEngineers,
    assignIssueToEngineer
} from "../controllers/Admin.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/rbac.middleware.js";

const router = Router();


router.post("/register", registerAdmin);
router.post("/login", loginAdmin);


router.use(verifyJWT);
router.use(authorizeRoles("admin"));

router.post("/logout", logoutAdmin);
router.get("/issues", getAllIssues);
router.get("/engineers", getAllEngineers);
router.patch("/issues/:issueId/assign", assignIssueToEngineer);

export default router;
