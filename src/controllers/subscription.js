import mongoose, {isValidObjectId} from "mongoose"
import { UserSchema } from "../models/user.js"
import { Subscription } from "../models/subscription.js"
import {ApiError} from "../utils/apiError.js"
import ApiResponse from "../utils/apiResponse.js"
import asyncHandler from "../utils/asyncHandler.js"


const toggleSubscription = asyncHandler(async (req, res) => {
    console.log("toggle hit");
    
    const {channelId} = req.params
    console.log(channelId);
    
    if(!channelId) {
        return ApiError(404, "Invalid channel id")
    }
    
    await Subscription.findOne({'subscriber' : new mongoose.Types.ObjectId(req.user._id),
         "channel" : new mongoose.Types.ObjectId(channelId)
})

    return res.status(200, "Channel unsubscribed successfully")
})

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const {channelId} = req.params
})

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params
})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}