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

// All routes require authentication
router.use(verifyJWT);

// User creates issue (only users can create issues)
router.post("/", authorizeRoles("user"), createIssue);

// Admin gets all issues
router.get("/", authorizeRoles("admin"), getAllIssues);

// User gets their own issues
router.get("/my-issues", authorizeRoles("user"), getUserIssues);

// Engineer gets their assigned issues
router.get("/engineer-issues", authorizeRoles("engineer"), getEngineerIssues);

// Get issue by ID (owner, assigned engineer, or admin)
router.get("/:id", authorizeIssueAccess, getIssueById);

// User updates their own issue
router.put("/:id", authorizeRoles("user"), authorizeIssueOwner, updateIssue);

// Engineer or admin updates issue status
router.patch("/:id/status", authorizeRoles("engineer", "admin"), authorizeAssignedEngineer, updateIssueStatus);

// Admin assigns engineer to issue
router.patch("/:id/assign", authorizeRoles("admin"), assignEngineer);

// Owner or admin deletes issue
router.delete("/:id", authorizeIssueOwner, deleteIssue);

export default router;
