import { Request, Response } from "express";
import { handle500ServerError } from "../lib/error.handlers";
import shopModel from "../models/shop.model";
import { decodeToken } from "../lib/auth";

export const createShop = async (req: Request, res: Response) => {
	try {
		const { name } = req.body
		const token = req.headers.authorization!
		const payload = decodeToken(token) as { id: string }
		console.log(payload)

		if (!name || !payload.id) {
			res.status(400).send({
				success: false,
				message: "please fill all fields"
			})
			return
		}

		const newShop = await new shopModel({
			name,
			vendor: payload.id
		}).save()

		res.status(200).send({
			success: true,
			message: "shop created successsfully",
			shop: newShop
		})

	} catch (error) {
		console.log(error)
		handle500ServerError(res)
	}
}

export const findShopsByVendor = async (req: Request, res: Response) => {
	try {
		const payload = decodeToken(req.headers.authorization!) as { id: string }
		const { id } = payload

		if (!id) {
			res.status(400).send({
				success: false,
				message: "auth token doesn't include id"
			})
			return
		}

		const shops = await shopModel.find({ vendor: id })

		res.status(200).send({
			success: true,
			messge: "fetched shops of current account",
			shops
		})

	} catch (error) {
		console.log(error)
		handle500ServerError(res)
	}
}

export const getShopDetails = async (req: Request, res: Response) => {
	try {
		const { id } = req.params
		const token = req.headers.authorization!
		const payload = decodeToken(token) as { id: string }

		const shop = await shopModel.findOne({ _id: id, vendor: payload.id })

		if (!shop) {
			res.status(200).send({
				success: false,
				message: "shop not found"
			})
			return
		}

		res.status(200).send({
			success: true,
			message: "shop details fetched successfully",
			shop
		})
	} catch (error) {
		console.log(error)
		handle500ServerError(res)
	}
}

export const editShop = () => { }
export const deleteShop = () => { }
