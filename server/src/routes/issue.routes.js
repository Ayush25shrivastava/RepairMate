import { Router } from "express";
import {
    createIssue,
    getAllIssues,
    getIssueById,
    getUserIssues,
    getEngineerIssues,
    updateIssueStatus,
    assignEngineer,
    updateIssue,
    deleteIssue
} from "../controllers/Issue.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
    authorizeRoles,
    authorizeIssueOwner,
    authorizeIssueAccess,
    authorizeAssignedEngineer
} from "../middlewares/rbac.middleware.js";

const router = Router();


router.use(verifyJWT);


router.post("/", authorizeRoles("user"), createIssue);


router.get("/", authorizeRoles("admin"), getAllIssues);


router.get("/my-issues", authorizeRoles("user"), getUserIssues);


router.get("/engineer-issues", authorizeRoles("engineer"), getEngineerIssues);


router.get("/:id", authorizeIssueAccess, getIssueById);


router.put("/:id", authorizeRoles("user"), authorizeIssueOwner, updateIssue);


router.patch("/:id/status", authorizeRoles("engineer", "admin"), authorizeAssignedEngineer, updateIssueStatus);


router.patch("/:id/assign", authorizeRoles("admin"), assignEngineer);


router.delete("/:id", authorizeIssueOwner, deleteIssue);

export default router;
