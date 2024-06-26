"use client"

import { handleAxiosError } from "@/lib/api"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import StaffInterface from "types/staff.interface"
import { Icon } from "@iconify/react/dist/iconify.js"
import ResetPassword from "@/components/staff/ResetPassword"
import { vendorApi } from "@/lib/vendorApi"
import { ScaleLoader } from "react-spinners"
import moment from "moment"

interface Props {
	params: {
		staffId: string
	}
}

const StaffView = ({ params }: Props) => {

	const [loading, setLoading] = useState(true)
	const [billCount, setBillCount] = useState(0)
	const [staff, setStaff] = useState<StaffInterface>({
		_id: "",
		username: "",
		password: "",
		shop: "",
		manager: false,
		blocked: false,
		createdAt: new Date()
	})

	useEffect(() => {
		vendorApi.get(`/staff/${params.staffId}`)
			.then(({ data }) => {
				if (data.success) {
					setStaff(data.staff)
				} else {
					toast.error(data.message)
				}
			})
			.catch(error => {
				handleAxiosError(error)
			}).finally(() => {
				setLoading(false)
			})

		vendorApi.get(`/bill/staff/no/${params.staffId}`)
			.then(({ data }) => {
				if (data.success) {
					setBillCount(data.bills)
				} else {
					toast.error(data.message)
				}
			}).catch(error => {
				handleAxiosError(error)
			})
	}, [params])

	const toggleBlock = async () => {
		try {
			const { data } = await vendorApi.put(`/staff/block/${params.staffId}`, { blocked: !staff.blocked })
			if (data.success) {
				setStaff(prev => ({ ...prev, blocked: !staff.blocked }))
				toast.success(data.message)
			} else {
				toast.error(data.message)
			}
		} catch (error) {
			handleAxiosError(error)
		}
	}

	const changeManagerStatus = async () => {
		try {
			const { data } = await vendorApi.put(`/staff/manager/${params.staffId}`, { manager: !staff?.manager })
			if (data.success) {
				setStaff(prev => ({ ...prev, manager: !prev.manager }))
				toast.success(data.message)
			} else {
				toast.error(data.message)
			}
		} catch (error) {
			handleAxiosError(error)
		}
	}

	if (loading) {
		return (
			<div className="flex items-center justify-center w-full h-full">
				<ScaleLoader />
			</div>
		)
	}

	return (
		<div className="flex flex-col gap-5 w-full h-full">
			<div className="flex flex-col lg:flex-row gap-5 items-center w-full">
				<div className="flex gap-5 h-full w-full p-5 bg-white rounded-lg drop-shadow-lg">

					<div className="flex flex-col gap-1 w-full">
						<div className="">
							<p className="text-lg font-bold">{staff?.username}</p>
						</div>
						<div className="flex items-center gap-2">
							<p className="text-lg font-bold">Started on: </p>
							<p className="font-bold">{moment(staff.createdAt).format("DD-MM-YYYY")}</p>
						</div>
					</div>

					<div className="flex flex-col items-end gap-3 w-full">
						<p className="bg-green-500 rounded-lg text-white font-bold px-3 py-1">{staff?.manager ? "manager" : "staff"}</p>
						<p className={`${staff?.blocked ? "bg-red-500" : "bg-green-500"} rounded-lg text-white font-bold px-3 py-1`}>{staff?.blocked ? "inactive" : "active"}</p>
					</div>

				</div>
				<div className="grid gap-5 grid-cols-2 grid-rows-2 h-full w-full">

					<div className="flex items-center justify-between p-4 bg-white rounded-lg drop-shadow-lg">
						<div>
							<p className="text-custom-light-gray">bills</p>
							<p className="font-bold">{billCount}</p>
						</div>
						<div className="flex items-center justify-center bg-primary rounded-xl w-[40px] h-[40px]">
							<Icon icon={"material-symbols:contract"} className="text-white text-2xl" />
						</div>
					</div>

					<div className="flex items-center justify-between p-4 bg-white rounded-lg drop-shadow-lg">
						<div>
							<p className="text-custom-light-gray">started</p>
							<p className="font-bold">{moment(staff.createdAt).format("DD-MM-YYYY")}</p>
						</div>
						<div className="flex items-center justify-center bg-primary rounded-xl w-[40px] h-[40px]">
							<Icon icon={"material-symbols:contract"} className="text-white text-2xl" />
						</div>
					</div>


					<div className="flex items-center justify-between p-4 bg-white rounded-lg drop-shadow-lg">
						<div>
							<p className="text-custom-light-gray">stock</p>
							<p className="font-bold"></p>
						</div>
						<div className="flex items-center justify-center bg-primary rounded-xl w-[40px] h-[40px]">
							<Icon icon={"material-symbols:contract"} className="text-white text-2xl" />
						</div>
					</div>

					<div className="flex items-center justify-between p-4 bg-white rounded-lg drop-shadow-lg">
						<div>
							<p className="text-custom-light-gray">rate</p>
							<p className="font-bold">0</p>
						</div>
						<div className="flex items-center justify-center bg-primary rounded-xl w-[40px] h-[40px]">
							<Icon icon={"material-symbols:contract"} className="text-white text-2xl" />
						</div>
					</div>

				</div>
			</div>
			<div className="flex gap-5 flex-wrap items-center w-full">
				<div className="flex font-bold items-center gap-3 p-3 bg-white rounded-lg drop-shadow-lg">
					<p>Reset passsword</p>
					<ResetPassword api={vendorApi} staffId={params.staffId}>
						<div className="bg-primary text-white font-bold px-6 py-2 rounded-lg drop-shadow-lg">
							Reset
						</div>
					</ResetPassword>
				</div>
				<div className="flex font-bold items-center gap-3 p-3 bg-white rounded-lg drop-shadow-lg">
					<p>
						{
							staff?.manager ?
								"Make staff" :
								"Make manager"
						}
					</p>
					<button onClick={e => { e.preventDefault(); changeManagerStatus() }} className={`${staff?.manager ? "bg-red-500" : "bg-primary"} text-white font-bold px-6 py-2 rounded-lg drop-shadow-lg`}>
						{
							staff?.manager ?
								"Demote" :
								"Promote"
						}
					</button>
				</div>
				<div className="flex font-bold items-center gap-3 p-3 bg-white rounded-lg drop-shadow-lg">
					<p>Block staff</p>
					<button onClick={e => { e.preventDefault(); toggleBlock() }} className={`${staff?.blocked ? "bg-primary" : "bg-red-500"} text-white font-bold px-6 py-2 rounded-lg drop-shadow-lg`}>
						{
							staff.blocked ?
								"Unblock" :
								"Block"
						}
					</button>
				</div>
			</div>
		</div >
	)
}

export default StaffView
