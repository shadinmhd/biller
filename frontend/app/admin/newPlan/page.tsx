"use client"
import { handleAxiosError } from '@/lib/api'
import { adminApi } from '@/lib/adminApi'
import cn from '@/lib/cn'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import React, { ReactNode } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

const formSchema = z.object({
	name: z.string().min(1, { message: "this field cannot be empty" }),
	description: z.string().min(1, { message: "please provide a catchy description" }),
	price: z.number().min(1, { message: "this value cannot be zero" }),
	discount: z.number(),
	active: z.boolean(),
	productLimit: z.number().min(1, { message: "this value cannot be zero" }),
	billLimit: z.number().min(1, { message: "this value cannot be zero" }),
})

type formType = z.infer<typeof formSchema>
type formFields = keyof formType


const NewPlan = () => {

	const { register, handleSubmit, formState: { errors } } = useForm<formType>({ resolver: zodResolver(formSchema) })
	const router = useRouter()

	const inputStyle = (name: formFields) => {
		return cn(" border-primary rounded-lg px-3 py-1	outline-none", errors[name] ? "border-red-500 placeholder:text-red-500 text-red-500" : "")
	}
	const onSubmit = async (data: formType) => {
		try {
			console.log(data)
			const response = await adminApi.post("/admin/plan", data)
			if (response.data.success) {
				router.push("/admin/plans")
			} else {
				toast.error(response.data.message)
			}
		} catch (error) {
			handleAxiosError(error)
		}
	}

	return (
		<div className='flex flex-col gap-5 items-start justify-start p-12 w-full h-full'>
			<div className='flex flex-col items-center p-2 bg-white drop-shadow-lg rounded-lg'>
				<p className='text-black font-bold text-xl'>New plan</p>
			</div>
			<form
				onSubmit={handleSubmit(onSubmit)}
				className='flex flex-col items-start gap-5 w-full'
			>
				<InputContainer name='Name' error={errors.name?.message}>
					<input
						id='name'
						{...register("name")}
						placeholder='Name'
						type="text"
						className={inputStyle("name")}
					/>
				</InputContainer>
				<InputContainer name='Description' error={errors.description?.message}>
					<input
						{...register("description")}
						placeholder='Descrptrion'
						type="text"
						className={inputStyle("description")}
					/>
				</InputContainer>
				<InputContainer name='Price' error={errors.price?.message}>
					<input
						{...register("price", { valueAsNumber: true })}
						placeholder='Price'
						defaultValue={0}
						type="number"
						className={inputStyle("price")}
					/>
				</InputContainer>
				<InputContainer name='Discount' error={errors.discount?.message}>
					<input
						{...register("discount", { valueAsNumber: true })}
						placeholder='Discount'
						defaultValue={0}
						type="number"
						className={inputStyle("discount")}
					/>
				</InputContainer>
				<InputContainer name='Product limit' error={errors.productLimit?.message}>
					<input
						{...register("productLimit", { valueAsNumber: true })}
						placeholder='Product limit'
						defaultValue={0}
						type="number"
						className={inputStyle("productLimit")}
					/>
				</InputContainer>
				<InputContainer name='Bill Limit' error={errors.billLimit?.message}>
					<input
						{...register("billLimit", { valueAsNumber: true })}
						placeholder='Bill Limit'
						defaultValue={0}
						type="number"
						className={inputStyle("billLimit")}
					/>
				</InputContainer>
				<InputContainer name='active' error={errors.active?.message}>
					<input
						{...register("active")}
						placeholder=''
						type="checkbox"
						className={inputStyle("active")}
					/>
				</InputContainer>
				<button className='bg-primary text-white px-6 py-2 font-bold rounded-lg'>
					create
				</button>
			</form >
		</div >
	)
}

const InputContainer = ({ children, name, error }: { name: string, children: ReactNode, error: string | undefined }) => {
	return (
		<div className='flex flex-col bg-white drop-shadow-lg p-2 rounded-lg font-semibold'>
			<div className='flex items-center gap-5'>
				<label>{[name[0].toUpperCase(), name.slice(1, name.length)]}: </label>
				{children}
			</div>
			{error && <p className='text-red-500'>{error}</p>}
		</div>
	)
}

export default NewPlan
