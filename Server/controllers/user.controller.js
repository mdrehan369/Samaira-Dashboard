import ApiResponse from "../utils/apiResponse.js";
import ApiError from "../utils/apiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { userModel } from "../models/user.model.js";

const getAllUsersController = asyncHandler(async (req, res) => {

    const users = await userModel.find({});

    return res
    .status(200)
    .json(new ApiResponse(200, users, "All Users Fetched Successfully"));

});

export {
    getAllUsersController
}