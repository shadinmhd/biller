"use client"
import { useStaff } from '@/context/staffContext'
import React, { useEffect, useState } from 'react'
import Sidebar from '../shared/Sidebar'

const StaffSidebar = () => {

	const { staff } = useStaff()

	const [links, setLinks] = useState<{ title: string, to: string, icon: string }[]>([])

	useEffect(() => {
		if (staff.manager) {
			setLinks([
				{ title: "Dashboard", to: "/staff", icon: "mdi:home" },
				{ title: "Staffs", to: "/staff/staffs", icon: "mdi:people-group" },
				{ title: "Customers", to: "/staff/customers", icon: "mdi:people-group" },
				{ title: "Products", to: "/staff/products", icon: "bi:boxes" },
				{ title: "Bills", to: "/staff/bills", icon: "mdi:books" },
				{ title: "Settings", to: "/staff/settings", icon: "mdi:gear" }
			])
		} else {
			setLinks([
				{ title: "Dashboard", to: "/staff", icon: "mdi:home" },
				{ title: "Customers", to: "/staff/customers", icon: "mdi:people-group" },
				{ title: "Products", to: "/staff/products", icon: "bi:boxes" },
				{ title: "Bills", to: "/staff/bills", icon: "mdi:books" },
				{ title: "Settings", to: "/staff/settings", icon: "mdi:gear" }
			])
		}
	}, [staff.manager])

	return (
		<Sidebar items={links} />
	)
}

export default StaffSidebar
