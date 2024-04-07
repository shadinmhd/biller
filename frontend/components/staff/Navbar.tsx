import { Icon } from "@iconify/react/dist/iconify.js"
import { Sheet, SheetContent, SheetTrigger } from "../shadcn/Sheet"
import { ReactNode, useEffect, useState } from "react"
import Link from "next/link"
import { useStaff } from "@/context/staffContext"


const Navbar = () => {
	return (
		<header className="flex lg:hidden w-full bg-custom-offwhite px-5 pt-5">
			<div className="flex items-center justify-between p-3 w-full h-fit bg-white drop-shadow-lg rounded-lg">
				<p className="text-xl font-extrabold">Biller</p>
				<div>
					<Sidebar>
						<Icon icon={"mdi:menu"} className="text-2xl" />
					</Sidebar>
				</div>
			</div>
		</header>
	)
}

const Sidebar = ({ children }: {
	children: ReactNode,
}) => {

	const { staff } = useStaff()
	const [items, setItems] = useState<{ title: string, to: string, icon: string }[]>([])

	useEffect(() => {
		if (staff.manager) {
			setItems([
				{ title: "Dashboard", to: "/staff", icon: "mdi:home" },
				{ title: "Staffs", to: "/staff/staffs", icon: "mdi:people-group" },
				{ title: "Customers", to: "/staff/customers", icon: "mdi:people-group" },
				{ title: "Products", to: "/staff/products", icon: "bi:boxes" },
				{ title: "Bills", to: "/staff/bills", icon: "mdi:books" },
				{ title: "Settings", to: "/staff/settings", icon: "mdi:gear" }
			])
		} else {
			setItems([
				{ title: "Dashboard", to: "/staff", icon: "mdi:home" },
				{ title: "Customers", to: "/staff/customers", icon: "mdi:people-group" },
				{ title: "Products", to: "/staff/products", icon: "bi:boxes" },
				{ title: "Bills", to: "/staff/bills", icon: "mdi:books" },
				{ title: "Settings", to: "/staff/settings", icon: "mdi:gear" }
			])
		}
	}, [staff.manager])

	return (
		<Sheet>
			<SheetTrigger className="outline-none">
				{children}
			</SheetTrigger>
			<SheetContent
				side="left"
				className="flex flex-col items-center bg-white"
			>
				<Link href={`/`} className="text-3xl text-primary font-bold md:px-4 md:py-3 w-full flex gap-5 md:pr-16 items-center">
					Biller
				</Link>
				{items.map((e, i) => (
					<SidebarItem
						key={i}
						title={e.title}
						to={e.to}
						icon={e.icon}
					/>
				))}
			</SheetContent>
		</Sheet >
	)
}

interface SidebarProps {
	title: string,
	to: string,
	icon: string
}

const SidebarItem = ({ title, to, icon }: SidebarProps) => {

	return (
		<Link href={to} className={`px-2 py-2 md:px-4 md:py-3 w-full flex gap-5 pr-6 md:pr-16 items-center`}>
			<div className={`p-2 bg-white rounded-lg drop-shadow-lg`}>
				<Icon icon={icon} className={`text-primary text-2xl`} />
			</div>
			<p className={`text-custom-light-gray`}>
				{title}
			</p>
		</Link>
	)
}

export default Navbar
