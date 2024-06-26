import { Router } from "express"
import {
	getCustomersByShop,
	createCustomer,
	getCustomerCountByShop,
	getCustomerDetails
} from "../controllers/customer.controller"
import authorizationMiddleware from "../middlewares/authorization.middleware"

const customerRoute = Router()

customerRoute.post("/", createCustomer)


customerRoute.get("/shop/:id", authorizationMiddleware("vendor", "staff", "manager"), getCustomersByShop)
customerRoute.get("/shop/:id/count", authorizationMiddleware("vendor", "staff", "manager", "admin"), getCustomerCountByShop)

customerRoute.get("/:id", getCustomerDetails)

export default customerRoute
