import { asynchandler } from "../utility/AsyncHandler.js";
import { Admin } from "../models/admin.model.js";
import Issue from "../models/Issue.model.js";
import Engineer from "../models/Engineer.model.js";
import { ApiError } from "../utility/ApiError.js";
import { ApiResponse } from "../utility/ApiResponse.js";

const generateAccessRefreshToken = async (adminId) => {
    try {
        const admin = await Admin.findById(adminId);
        if (!admin) {
            throw new ApiError(404, "Admin not found while generating token")
        }

        const accesstoken = admin.generateAccessToken();
        const refreshtoken = admin.generateRefreshToken();
        admin.refreshtoken = refreshtoken;
        await admin.save({ validateBeforeSave: false });
        return { accesstoken, refreshtoken };
    } catch (error) {
        console.log(error);
        throw new ApiError(500, "Some error occurred in generating access token and refresh token");
    }
};

const registerAdmin = asynchandler(async (req, res) => {
    const { name, email, password, phone, adminId } = req.body;

    if ([name, email, password, adminId].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }

    const existedAdmin = await Admin.findOne({
        $or: [{ email }, { adminId }]
    });

    if (existedAdmin) {
        throw new ApiError(409, "Admin with email or Admin ID already exists");
    }

    const admin = await Admin.create({
        name,
        email,
        password,
        phone,
        adminId
    });

    const createdAdmin = await Admin.findById(admin._id).select("-password -refreshtoken");

    if (!createdAdmin) {
        throw new ApiError(500, "Something went wrong while registering the admin");
    }

    return res.status(201).json(
        new ApiResponse(200, createdAdmin, "Admin registered successfully")
    );
});

const loginAdmin = asynchandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new ApiError(400, "Email and password are required");
    }

    const admin = await Admin.findOne({ email });

    if (!admin) {
        throw new ApiError(404, "Admin does not exist");
    }

    const isPasswordValid = await admin.comparePassword(password);

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid user credentials");
    }

    const { accesstoken, refreshtoken } = await generateAccessRefreshToken(admin._id);

    const loggedInAdmin = await Admin.findById(admin._id).select("-password -refreshtoken");

    const options = {
        httpOnly: true,
        secure: true
    };

    return res
        .status(200)
        .cookie("accesstoken", accesstoken, options)
        .cookie("refreshtoken", refreshtoken, options)
        .json(
            new ApiResponse(
                200,
                {
                    admin: loggedInAdmin,
                    accesstoken,
                    refreshtoken
                },
                "Admin logged in successfully"
            )
        );
});

const logoutAdmin = asynchandler(async (req, res) => {
    await Admin.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshtoken: undefined
            }
        },
        {
            new: true
        }
    );

    const options = {
        httpOnly: true,
        secure: true
    };

    return res
        .status(200)
        .clearCookie("accesstoken", options)
        .clearCookie("refreshtoken", options)
        .json(new ApiResponse(200, {}, "Admin logged out successfully"));
});


const getAllIssues = asynchandler(async (req, res) => {
    const issues = await Issue.find()
        .populate('user', 'name email phone')
        .populate('Engineer', 'name email phone')
        .sort({ createdAt: -1 });

    return res
        .status(200)
        .json(new ApiResponse(200, issues, "All issues fetched successfully"));
});


const getAllEngineers = asynchandler(async (req, res) => {
    const engineers = await Engineer.find().select("-password");

    return res
        .status(200)
        .json(new ApiResponse(200, engineers, "All engineers fetched successfully"));
});


const assignIssueToEngineer = asynchandler(async (req, res) => {
    const { issueId } = req.params;
    const { engineerId } = req.body;

    if (!engineerId) {
        throw new ApiError(400, "Engineer ID is required");
    }

    const engineer = await Engineer.findById(engineerId);
    if (!engineer) {
        throw new ApiError(404, "Engineer not found");
    }

    const issue = await Issue.findByIdAndUpdate(
        issueId,
        {
            Engineer: engineerId,
            status: "ASSIGNED"
        },
        { new: true }
    )
        .populate('user', 'name email phone')
        .populate('Engineer', 'name email phone');

    if (!issue) {
        throw new ApiError(404, "Issue not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, issue, "Issue assigned to engineer successfully"));
});

export {
    registerAdmin,
    loginAdmin,
    logoutAdmin,
    getAllIssues,
    getAllEngineers,
    assignIssueToEngineer
};
