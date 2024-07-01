import { Router } from "express"
import { check } from "../middlewares/auth.middleware.js"
import {
    cancelOrderController,
    getAllOrdersController,
    getCountsController,
    getOrderController,
    markDeliveredController
} from "../controllers/orders.controller.js";

const router = Router();

// router.use(check);

router.route('/').get(check, getAllOrdersController);
router.route('/:orderId').put(check, markDeliveredController);
router.route('/count').get(check, getCountsController);
router.route('/order/:orderId').get(check, getOrderController);
router.route('/cancel/:orderId').get(check, cancelOrderController);

export default router;