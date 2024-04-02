"use client"
import { Separator } from '@/components/shadcn/Seperator'
import { useStaff } from '@/context/staffContext'
import { handleAxiosError } from '@/lib/api'
import { staffApi } from '@/lib/staffApi'
import { Icon } from '@iconify/react/dist/iconify.js'
import moment from 'moment'
import { useRouter } from 'next/navigation'
import React, { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'
import BillInterface from 'types/bill.interface'
import ProductInterface from 'types/product.interface'

interface Props {
	params: {
		id: string
	}
}

interface CompleteBillInterface extends Omit<BillInterface, "products"> {
	products: ({ product: ProductInterface, quantity: number })[]
}

const BillView = ({ params }: Props) => {

	const [bill, setBill] = useState<CompleteBillInterface>()
	const { staff } = useStaff()
	const router = useRouter()

	useEffect(() => {
		staffApi.get(`/bill/${params.id}`)
			.then(({ data }) => {
				if (data.success) {
					setBill(data.bill)
					console.log(data.bill)
				} else {
					toast.error(data.message)
				}
			})
			.catch(error => {
				handleAxiosError(error)
			})
	}, [params.id])

	const deleteBill = useCallback(async () => {
		if (bill?._id) {
			try {
				const { data } = await staffApi.delete(`/bill/${bill?._id}`)
				if (data.success) {
					router.back()
					toast.success(data.message)
				} else {
					toast.error(data.message)
				}
			} catch (error) {
				handleAxiosError(error)
			}
		} else {
			toast.error("something went wrong")
		}
	}, [bill, router])

	return (
		<div className='flex flex-col p-5 gap-5 bg-white rounded-lg drop-shadow-lg h-full w-full'>
			<div className='flex w-full justify-between'>
				<p className='text-3xl font-bold'>Bill</p>
			</div>
			<div className='flex flex-col items-start'>
				<div className='flex gap-5'>
					<p>Date: </p>
					<p>{moment(bill?.createdAt).format("DD/MM/YYYY")}</p>
				</div>
				<div className='flex gap-5'>
					<p>No of items: </p>
					<p>{bill?.products.length}</p>
				</div>
				<div className='flex gap-5'>
					<p>Total mrp: </p>
					<p>{bill?.total}</p>
				</div>
				<div className='flex gap-5'>
					<p>Discount: </p>
					<p>{bill?.discount}</p>
				</div>
				<div className='flex gap-5'>
					<p>Total: </p>
					<p>{bill?.totalAtfterDiscount}</p>
				</div>
			</div>
			<div className='flex flex-col'>
				<div className='flex flex-col items-center w-full'>
					<div className='flex text-custom-light-gray items-center w-full'>
						<p className='w-full'>Name</p>
						<p className='w-full'>Qty</p>
						<p className='w-full'>Price</p>
						<p className='w-full'>Total</p>
					</div>
					<Separator orientation='horizontal' className='w-full bg-custom-light-gray opacity-55' />
				</div>
				{
					bill?.products.map((e, i) => (
						<div
							key={i}
							className='flex flex-col w-full'
						>
							<div className='flex w-full h-10 items-center'>
								<p className='w-full'>{e.product.name}</p>
								<p className='w-full'>{e.quantity}</p>
								<p className='w-full'>{e.product.price}</p>
								<p className='w-full'>{e.product.price * e.quantity}</p>
							</div>
							<Separator orientation='horizontal' className='w-full bg-custom-light-gray opacity-55' />
						</div>
					))
				}
			</div>
		</div>
	)
}

export default BillView
