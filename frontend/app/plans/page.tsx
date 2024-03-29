"use client"
import Footer from "@/components/Footer"
import Navbar from "@/components/Navbar"
import api, { handleAxiosError } from "@/lib/api"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import PlanInterface from "types/plan.interface"

const Plans = () => {

	const [plans, setPlans] = useState<PlanInterface[]>([])
	const router = useRouter()

	useEffect(() => {
		api.get("/plan")
			.then(({ data }) => {
				if (data.success) {
					setPlans(data.plans)
				} else {
					toast.error(data.message)
				}
			})
			.catch((error) => {
				handleAxiosError(error)
			})
	}, [])

	const getStarted = () => {
		if (localStorage.getItem("vendor-token"))
			router.push("/vendor")
		else
			router.push("/login")
	}

	return (
		<div className="flex flex-col w-screen h-screen bg-custom-offwhite">
			<Navbar />
			<div className="flex justify-center gap-5 h-full p-10">
				{plans.map((e, i) => (
					<div key={i} className="flex flex-col gap-2 items-start bg-white rounded-lg drop-shadow-lg p-5">
						<div className="flex items-center justify-between gap-5 w-full">
							<div className="flex flex-col">
								<p className="text-2xl font-bold">{[e.name[0].toUpperCase(), e.name.slice(1, e.name.length)]}</p>
								<span className="w-full h-1 bg-primary rounded-full"></span>
							</div>
							<p className="text-3xl font-bold">₹{e.price}/M</p>
						</div>
						<p className="text-lg break-words font-bold">
							{e.description}
						</p>
						<ul className="flex list-disc pl-5 font-bold flex-col h-full">
							<li>Maximum number of shops: {e.shopLimit}</li>
							<li>Maximum number of staffs: {e.staffLimit}</li>
							<li>Maximum number of producs: {e.productLimit}</li>
							<li>24/7 customer support</li>
							<li>online data backup</li>
						</ul>
						<button onClick={() => getStarted()} className="bg-primary text-white px-6 py-2 font-bold rounded-full">
							Get started
						</button>
					</div>
				))}
			</div>
			<Footer />
		</div>
	)
}

export default Plans 
