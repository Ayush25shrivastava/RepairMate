import { asynchandler } from "../utility/AsyncHandler.js";
import Engineer from "../models/Engineer.model.js";
import { ApiError } from "../utility/ApiError.js";
import { ApiResponse } from "../utility/ApiResponse.js";


const generateAccessRefreshToken = async (userId) => {

    try {
        const engineer = await Engineer.findById(userId);
        if (!engineer) {
            throw new ApiError(404, "engineer not found while generating token")
        }

        const accesstoken = engineer.generateAccessToken();
        const refreshtoken = engineer.generateRefreshToken();
        engineer.refreshtoken = refreshtoken;
        await engineer.save({ validateBeforeSave: false });
        return { accesstoken, refreshtoken };
    } catch (error) {
        console.log(error);
        throw new ApiError(500, "Some error occurred in generating access token and refresh token");
    }
};

const RegisterEngineer = asynchandler(async (req, res) => {
    const { UserName, email, Phone, password, role } = req.body
    console.log("getting info", req.body)
    if ([UserName, email, Phone, password].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "all fields are required")
    }
    const exsisteduser = await Engineer.findOne({
        $or: [{ email }, { Phone }]
    })
    if (exsisteduser) {
        throw new ApiError(409, "engineer already exists")
    }
    const engineer = await Engineer.create({
        name: UserName,
        email,
        phone: Phone,
        password,
        role: role || "engineer"
    })
    const createdEngineer = await Engineer.findById(engineer._id).select("-password")
    if (!createdEngineer) {
        throw new ApiError(500, "something went wrong while creating the engineer")
    }
    return res
        .status(201)
        .json(new ApiResponse(200, createdEngineer, "engineer created successfully"))
})

const LoginEngineer = asynchandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        throw new ApiError(400, "all credentials are required")
    }
    const engineer = await Engineer.findOne({ email }).select("+password");
    if (!engineer) {
        throw new ApiError(404, "engineer does not exist")
    }
    const isPasswordvalid = await engineer.comparePassword(password);
    if (!isPasswordvalid) {
        throw new ApiError(401, "password is incorrect")
    }
    const { accesstoken, refreshtoken } = await generateAccessRefreshToken(engineer._id)
    const loggedInEngineer = await Engineer.findById(engineer._id).select("-password -refreshtoken")
    const options = { httpOnly: true, secure: true };
    return res
        .status(200)
        .cookie("accesstoken", accesstoken, options)
        .cookie("refreshtoken", refreshtoken, options)
        .json(new ApiResponse(200, { engineer: loggedInEngineer, accesstoken, refreshtoken }, "engineer logged in successfully"))

})
const logoutUser = asynchandler(async (req, res) => {
    await Engineer.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshtoken: undefined
            }
        },
        {
            new: true
        }
    )
    const options = {
        httpOnly: true,
        secure: true
    }
    return res
        .status(200)
        .clearCookie("accesstoken", options)
        .clearCookie("refreshtoken", options)
        .json(new ApiResponse(200, {}, "engineer logged out"))
})
export {
    generateAccessRefreshToken,
    RegisterEngineer,
    LoginEngineer,
    logoutUser
}

