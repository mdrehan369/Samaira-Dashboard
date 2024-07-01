import ApiResponse from "../utils/apiResponse.js";
import ApiError from "../utils/apiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { productModel } from "../models/product.model.js";
import { uploadToCloudinary, deleteImage } from "../utils/cloudinary.js";

const addProductController = asyncHandler(async (req, res) => {

    const { title, description, category, price, comparePrice, onTop, color } = req.body;

    if ([title, description, category, price, comparePrice].some((field) => field?.trim() === '')) {
        throw new ApiError(400, "Some fields are missing");
    }

    const imagesRecieved = req.files;
    let images = [];

    for (let image of imagesRecieved) {
        const img = await uploadToCloudinary(image.path);
        images.push(img);
    }

    const product = await productModel.create({ title, description, category, price, comparePrice, images, onTop, color });

    return res
        .status(200)
        .json(new ApiResponse(200, product, "Product Created Successfully"));

});

const deleteProductController = asyncHandler(async (req, res) => {

    const { productId } = req.params;

    if (!productId) {
        throw new ApiError(400, "No Product ID provided");
    }

    const product = await productModel.findById(productId);

    if (!product) {
        throw new ApiError(400, "No Product Found");
    }

    if (product.image) {
        await deleteImage(product.image.publicId);
    } else {
        for (let image of product.images) {
            await deleteImage(image.publicId);
        }
    }

    await product.deleteOne();

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Product Deleted Successfully"));

});

const getAllProductsController = asyncHandler(async (req, res) => {

    const { page } = req.query;
    const products = await productModel.aggregate([
        {
            '$match': {
                'onTop': true
            }
        },
        {
            '$skip': page * 12
        },
        {
            '$sample': {
                'size': 12
            }
        }
    ]);

    return res
        .status(200)
        .json(new ApiResponse(200, products, "All Products Fetched Successfully"));

});

const getProductController = asyncHandler(async (req, res) => {

    const { productId } = req.params;

    if (!productId) {
        throw new ApiError(400, "No Product ID provided");
    }
    
    const product = await productModel.findById(productId);

    if(!product) throw new ApiError(404, "No Product Found");

    const products = await productModel.aggregate([
        {
            '$match': {
                'title': product.title
            }
        }, {
            '$lookup': {
                'from': 'reviews',
                'localField': '_id',
                'foreignField': 'product',
                'as': 'reviews'
            }
        }
    ]);

    return res
        .status(200)
        .json(new ApiResponse(200, products, "Product Fetched Successfully"));

});

const getSearchProductsController = asyncHandler(async (req, res) => {

    const { search } = req.query;

    const products = await productModel.aggregate([
        {
            '$match': {
                'title': {
                    '$regex': new RegExp(search),
                    '$options': 'i'
                }
            }
        },
        {
            '$sort': {
                'onTop': -1
            }
        }
    ]);

    res
        .status(200)
        .json(new ApiResponse(200, products, "products fetched"));

});

const getProductsByCategory = asyncHandler(async (req, res) => {

    let { category, limit, attribute, order, page } = req.query;
    if (!category) {
        res.redirect("/")
        return;
    }

    if (!limit) {
        limit = 1000
    }

    if (!order) {
        order = -1;
    }

    if (!attribute) {
        attribute = 'createdAt'
    }

    limit = Number(limit);
    order = Number(order);

    const obj = [
        {
            '$match': {
                'category': category
            }
        },
        {
            '$sort': {
            }
        },
        {
            '$skip': page ? (page - 1) * limit : 0
        },
        {
            '$limit': limit
        }
    ];

    obj[1]['$sort'][attribute] = order;

    const products = await productModel.aggregate(obj);

    res
        .status(200)
        .json(new ApiResponse(200, products, "Products fetched"));

});

export {
    addProductController,
    getAllProductsController,
    getProductController,
    getProductsByCategory,
    getSearchProductsController,
    deleteProductController
}
