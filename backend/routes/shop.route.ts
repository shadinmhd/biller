import { Router } from "express";
import { createShop, findShopsByVendor, getShopDetails, getShopCount } from "../controllers/shop.controller";
import authorizationMiddleware from "../middlewares/authorization.middleware";
const shopRouter = Router()

shopRouter.route("/")
	.post(authorizationMiddleware("vendor"), createShop)
	.get(authorizationMiddleware("vendor"), findShopsByVendor)

shopRouter.get("/count", authorizationMiddleware("vendor"), getShopCount)
shopRouter.get("/:id", authorizationMiddleware("vendor"), getShopDetails)

export default shopRouter
