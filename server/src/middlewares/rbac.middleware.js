import { ApiError } from "../utility/ApiError.js";
import { asynchandler } from "../utility/AsyncHandler.js";
import Issue from "../models/Issue.model.js";


export const authorizeRoles = (...allowedRoles) => {
    return asynchandler(async (req, res, next) => {
        if (!req.role) {
            throw new ApiError(401, "Authentication required");
        }

        if (!allowedRoles.includes(req.role)) {
            throw new ApiError(
                403,
                `Access denied. Role '${req.role}' is not authorized to access this resource`
            );
        }

        next();
    });
};


export const authorizeIssueOwner = asynchandler(async (req, res, next) => {
    const { id } = req.params;

    if (!id) {
        throw new ApiError(400, "Issue ID is required");
    }

    const issue = await Issue.findById(id);

    if (!issue) {
        throw new ApiError(404, "Issue not found");
    }


    if (req.role === "admin") {
        req.issue = issue;
        return next();
    }


    if (issue.user.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to perform this action on this issue");
    }

    req.issue = issue;
    next();
});


export const authorizeIssueAccess = asynchandler(async (req, res, next) => {
    const { id } = req.params;

    if (!id) {
        throw new ApiError(400, "Issue ID is required");
    }

    const issue = await Issue.findById(id);

    if (!issue) {
        throw new ApiError(404, "Issue not found");
    }


    if (req.role === "admin") {
        req.issue = issue;
        return next();
    }


    if (issue.user.toString() === req.user._id.toString()) {
        req.issue = issue;
        return next();
    }


    if (req.role === "engineer" && issue.Engineer &&
        issue.Engineer.toString() === req.user._id.toString()) {
        req.issue = issue;
        return next();
    }

    throw new ApiError(403, "You are not authorized to access this issue");
});


export const authorizeAssignedEngineer = asynchandler(async (req, res, next) => {
    const { id } = req.params;

    if (!id) {
        throw new ApiError(400, "Issue ID is required");
    }

    const issue = await Issue.findById(id);

    if (!issue) {
        throw new ApiError(404, "Issue not found");
    }


    if (req.role === "admin") {
        req.issue = issue;
        return next();
    }


    if (req.role === "engineer") {
        if (!issue.Engineer || issue.Engineer.toString() !== req.user._id.toString()) {
            throw new ApiError(403, "You can only update issues assigned to you");
        }
        req.issue = issue;
        return next();
    }

    throw new ApiError(403, "Only admins and assigned engineers can update issue status");
});
