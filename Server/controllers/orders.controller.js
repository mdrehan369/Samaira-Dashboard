import ApiResponse from "../utils/apiResponse.js";
import ApiError from "../utils/apiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { orderModel } from "../models/order.model.js"
import mongoose from "mongoose";

const getCountsController = asyncHandler(async (req, res) => {

    const counts = await orderModel.aggregate([
        {
            '$project': {
                '_id': 0,
                'pending': {
                    '$cond': [
                        {
                            '$eq': [
                                '$isPending', true
                            ]
                        }, 1, 0
                    ]
                },
                'cancelled': {
                    '$cond': [
                        {
                            '$eq': [
                                '$isCancelled', true
                            ]
                        }, 1, 0
                    ]
                },
                'delivered': {
                    '$cond': [
                        {
                            '$eq': [
                                '$isPending', false
                            ]
                        }, 1, 0
                    ]
                }
            }
        }, {
            '$group': {
                '_id': null,
                'pendingCount': {
                    '$sum': '$pending'
                },
                'cancelledCount': {
                    '$sum': '$cancelled'
                },
                'deliveredCount': {
                    '$sum': '$delivered'
                }
            }
        }
    ])

    return res
        .status(200)
        .json(new ApiResponse(200, { counts }, "Fetched Successfully"));

});

const getAllOrdersController = asyncHandler(async (req, res) => {

    let { all } = req.query;
    const { country, status, payment } = req.query;
    // console.log(country, status)

    let orders = null;

    let matchObj = {};

    if (country != '') matchObj["shippingDetails.country"] = country
    if (payment != '') matchObj["paymentMethod"] = payment
    if (status != '') {
        if(status == 'cancelled') matchObj['isCancelled'] = true;
        if(status == 'pending') matchObj['isPending'] = true;
        else matchObj['isPending'] = false
    }

    if (all !== 'user') {
        orders = await orderModel.aggregate([
            {
                '$match': matchObj
            },
            {
                '$lookup': {
                    'from': 'products',
                    'localField': 'cart.product',
                    'foreignField': '_id',
                    'as': 'products',
                    'pipeline': [
                        {
                            '$project': {
                                'description': 0,
                                'itemsSold': 0,
                                'history': 0,
                                'createdAt': 0,
                                'updatedAt': 0
                            }
                        }
                    ]
                }
            }, {
                '$project': {
                    'sessionId': 0,
                    'phonepeMerchantTransactionId': 0
                }
            }, {
                '$sort': {
                    'createdAt': -1
                }
            }
        ])

        return res
            .status(200)
            .json(new ApiResponse(200, orders, "Orders Fetched Successfully"));
    } else {

        console.log(matchObj);

        orders = await orderModel.aggregate([
            {
                '$match': {
                    'user': new mongoose.Types.ObjectId(req.user._id)
                }
            }, {
                '$lookup': {
                    'from': 'products',
                    'localField': 'cart.product',
                    'foreignField': '_id',
                    'as': 'products',
                    'pipeline': [
                        {
                            '$project': {
                                'description': 0,
                                'itemsSold': 0,
                                'history': 0,
                                'createdAt': 0,
                                'updatedAt': 0
                            }
                        }
                    ]
                }
            }, {
                '$project': {
                    'sessionId': 0,
                    'phonepeMerchantTransactionId': 0
                }
            }, {
                '$sort': {
                    'createdAt': -1
                }
            }
        ]);

        return res
            .status(200)
            .json(new ApiResponse(200, orders, "Orders Fetched Successfully"));
    }

});

const getOrderController = asyncHandler(async (req, res) => {

    const { orderId } = req.params;

    const orders = await orderModel.aggregate([
        {
            '$match': {
                '_id': new mongoose.Types.ObjectId(orderId)
            }
        }, {
            '$lookup': {
                'from': 'products',
                'localField': 'cart.product',
                'foreignField': '_id',
                'as': 'products',
                'pipeline': [
                    {
                        '$project': {
                            'description': 0,
                            'itemsSold': 0,
                            'history': 0,
                            'createdAt': 0,
                            'updatedAt': 0
                        }
                    }
                ]
            }
        }, 
        {
            '$sort': {
                'createdAt': -1
            }
        }
    ]);

    return res
    .status(200)
    .json(new ApiResponse(200, orders, "Order Fetched Successfully"));

});

const markDeliveredController = asyncHandler(async (req, res) => {

    const { orderId } = req.params;
    if(!orderId) throw new ApiError(404, "No OrderID Given");

    const order = await orderModel.findById(orderId);
    order.isPending = false;
    order.deliveryDate = new Date().toISOString();

    await order.save();

    return res
    .status(200)
    .json(new ApiResponse(200, {}, "Order Updated Successfully"));

});

const cancelOrderController = asyncHandler(async (req, res) => {

    const { orderId } = req.params;

    if (!orderId) throw new ApiError(400, "No OrderId Found");

    const order = await orderModel.findById(orderId);

    if (!order) throw new ApiError(401, "No Order Found");

    order.isCancelled = true;
    order.isPending = false;
    await order.save();

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Order Cancelled Successfully"));

});


export {
    getCountsController,
    getAllOrdersController,
    getOrderController,
    markDeliveredController,
    cancelOrderController
}