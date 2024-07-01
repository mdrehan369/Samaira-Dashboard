import { Router } from "express";
import { check } from "../middlewares/auth.middleware.js"
import {
    addProductController,
    deleteProductController,
    getAllProductsController,
    getProductController,
    getSearchProductsController
} from "../controllers/product.controller.js";
import { upload } from "../utils/cloudinary.js";

const router = Router();

// router.use(check);

router.route('/').get(check, getSearchProductsController);
router.route('/').post( check, upload.array("images"), addProductController);
router.route('/:productId').delete(check, deleteProductController);
router.route('/product/:productId').get(check, getProductController);


export default router;