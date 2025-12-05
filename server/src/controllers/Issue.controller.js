import { asynchandler } from "../utility/AsyncHandler.js";
import Issue from "../models/Issue.model.js";
import { ApiError } from "../utility/ApiError.js";
import { ApiResponse } from "../utility/ApiResponse.js";


const createIssue = asynchandler(async (req, res) => {
    const { title, description, location, attachment, priority, type } = req.body;


    if (!title || !description) {
        throw new ApiError(400, "Title and description are required");
    }


    const issue = await Issue.create({
        title,
        description,
        location: location || {},
        attachment,
        priority: priority || 'MEDIUM',
        type: type || 'OTHER',
        user: req.user._id,
        status: 'PENDING'
    });

    const createdIssue = await Issue.findById(issue._id)
        .populate('user', 'name email phone')
        .select('-__v');

    if (!createdIssue) {
        throw new ApiError(500, "Failed to create issue");
    }

    return res
        .status(201)
        .json(new ApiResponse(201, createdIssue, "Issue created successfully"));
});


const getAllIssues = asynchandler(async (req, res) => {
    const { status, priority, type, userId } = req.query;


    const filter = {};
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (type) filter.type = type;
    if (userId) filter.user = userId;

    const issues = await Issue.find(filter)
        .populate('user', 'name email phone')
        .populate('Engineer', 'name email phone')
        .sort({ createdAt: -1 })
        .select('-__v');

    return res
        .status(200)
        .json(new ApiResponse(200, issues, "Issues retrieved successfully"));
});


const getIssueById = asynchandler(async (req, res) => {
    const { id } = req.params;

    const issue = await Issue.findById(id)
        .populate('user', 'name email phone')
        .populate('Engineer', 'name email phone')
        .select('-__v');

    if (!issue) {
        throw new ApiError(404, "Issue not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, issue, "Issue retrieved successfully"));
});


const getUserIssues = asynchandler(async (req, res) => {
    const userId = req.user._id;

    const issues = await Issue.find({ user: userId })
        .populate('Engineer', 'name email phone')
        .sort({ createdAt: -1 })
        .select('-__v');

    return res
        .status(200)
        .json(new ApiResponse(200, issues, "User issues retrieved successfully"));
});


const getEngineerIssues = asynchandler(async (req, res) => {
    const engineerId = req.user._id;

    const issues = await Issue.find({ Engineer: engineerId })
        .populate('user', 'name email phone')
        .sort({ createdAt: -1 })
        .select('-__v');

    return res
        .status(200)
        .json(new ApiResponse(200, issues, "Engineer issues retrieved successfully"));
});


const updateIssueStatus = asynchandler(async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
        throw new ApiError(400, "Status is required");
    }

    const validStatuses = ['PENDING', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'];
    if (!validStatuses.includes(status)) {
        throw new ApiError(400, "Invalid status value");
    }

    const issue = await Issue.findByIdAndUpdate(
        id,
        { status },
        { new: true, runValidators: true }
    )
        .populate('user', 'name email phone')
        .populate('Engineer', 'name email phone')
        .select('-__v');

    if (!issue) {
        throw new ApiError(404, "Issue not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, issue, "Issue status updated successfully"));
});


const assignEngineer = asynchandler(async (req, res) => {
    const { id } = req.params;
    const { engineerId } = req.body;

    if (!engineerId) {
        throw new ApiError(400, "Engineer ID is required");
    }

    const issue = await Issue.findByIdAndUpdate(
        id,
        {
            Engineer: engineerId,
            status: 'ASSIGNED'
        },
        { new: true, runValidators: true }
    )
        .populate('user', 'name email phone')
        .populate('Engineer', 'name email phone')
        .select('-__v');

    if (!issue) {
        throw new ApiError(404, "Issue not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, issue, "Engineer assigned successfully"));
});


const updateIssue = asynchandler(async (req, res) => {
    const { id } = req.params;
    const { title, description, location, priority, type, attachment } = req.body;

    const updateData = {};
    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (location) updateData.location = location;
    if (priority) updateData.priority = priority;
    if (type) updateData.type = type;
    if (attachment) updateData.attachment = attachment;

    const issue = await Issue.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
    )
        .populate('user', 'name email phone')
        .populate('Engineer', 'name email phone')
        .select('-__v');

    if (!issue) {
        throw new ApiError(404, "Issue not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, issue, "Issue updated successfully"));
});


const deleteIssue = asynchandler(async (req, res) => {
    const { id } = req.params;

    const issue = await Issue.findByIdAndDelete(id);

    if (!issue) {
        throw new ApiError(404, "Issue not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Issue deleted successfully"));
});

export {
    createIssue,
    getAllIssues,
    getIssueById,
    getUserIssues,
    getEngineerIssues,
    updateIssueStatus,
    assignEngineer,
    updateIssue,
    deleteIssue
};
