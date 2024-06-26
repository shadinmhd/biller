"use client"
import EditProduct from "@/components/EditProduct"
import { Separator } from "@/components/shadcn/Seperator"
import YesNoModal from "@/components/shared/YesNoModal"
import { handleAxiosError } from "@/lib/api"
import moment from "moment"
import { useRouter } from "next/navigation"
import { useCallback, useEffect, useState } from "react"
import { toast } from "sonner"
import ProductInterface from "types/product.interface"
import { Icon } from "@iconify/react/dist/iconify.js"
import { ScaleLoader } from "react-spinners"
import { BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title, Tooltip } from "chart.js"
import ProductGraph from "@/components/shared/ProductGraph"
import { vendorApi } from "@/lib/vendorApi"

ChartJS.register(
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend
)

interface Props {
	params: {
		productId: string
	}
}

const ProductView = ({ params }: Props) => {

	const [product, setProduct] = useState<ProductInterface>({
		_id: "",
		name: "",
		image: "",
		brand: "",
		listed: false,
		shop: "",
		price: 0,
		stock: 0,
		sold: 0,
		barcode: "",
		profit: 0,
		point: 0,
		createdAt: new Date(),
	})
	const [data, setData] = useState<{ date: string, quantity: number }[]>([])

	const [loading, setLoading] = useState(true)
	const router = useRouter()

	useEffect(() => {
		vendorApi.get(`/product/${params.productId}`)
			.then(({ data }) => {
				if (data.success) {
					setProduct(data.product)
				} else {
					toast.error(data.message)
				}
			})
			.catch(error => {
				handleAxiosError(error)
			})
			.finally(() => {
				setLoading(false)
			})

	}, [params])

	const deleteProduct = useCallback(async () => {
		try {
			const { data } = await vendorApi.delete(`/product/${product?._id}`)
			if (data.success) {
				router.back()
				toast.success(data.message)
			} else {
				toast.error(data.message)
			}
		} catch (error) {
			handleAxiosError(error)
		}
	}, [product?._id, router])

	const toggleListing = useCallback(async () => {
		try {
			const { data } = await vendorApi.put(`/product/list/${product._id}`, { listed: !product.listed })

			if (data.success) {
				let temp = { ...product }
				temp.listed = product.listed ? false : true
				toast.success(data.message)
				setProduct(temp)
			} else {
				toast.error(data.message)
			}
		} catch (error) {
			handleAxiosError(error)
		}
	}, [product])

	if (loading) {
		return (
			<div className="flex items-center justify-center bg-white rounded-lg drop-shadow-lg w-full h-full">
				<ScaleLoader />
			</div>
		)
	}

	return (
		<div className="flex gap-5 flex-col w-full h-full">

			<div className="flex items-center gap-5 w-full h-56 ">

				<div className="flex items-center bg-white p-3 drop-shadow-lg rounded-lg w-full h-full">
					<div className="flex flex-col gap-1 items-start h-full w-full">
						<div className={`flex items-center justify-center size-20 rounded-lg ${product.image && "border"} border-primary p-1`}>
							{
								product.image ?
									<img src={product.image} className="w-full h-full" alt="" /> :
									<Icon icon={"mdi:image"} className="text-9xl" />
							}
						</div>
						<p className="font-semibold">{product.name}</p>
						<p className="text-gray-500 cursor-pointer"
							onClick={(e) => {
								e.preventDefault()
								navigator.clipboard.writeText(product.barcode)
								toast.success("copied barcode")
							}}>
							{`barcode: ${product.barcode}`}
						</p>
					</div>
					<div className="flex items-start h-full">
						<div className={product.listed ? "bg-green-500 text-white font-bold p-1 px-2 rounded-lg" : "bg-red-500 text-white font-bold p-1 px-2 rounded-lg"}>
							{
								product.listed ?
									"Listed" : "Hidden"
							}
						</div>
					</div>
				</div>

				<div className="grid gap-5 grid-cols-2 grid-rows-2 h-full w-full">

					<div className="flex items-center justify-between p-4 bg-white rounded-lg drop-shadow-lg">
						<div>
							<p className="text-custom-light-gray">sold</p>
							<p className="font-bold">{product.sold}</p>
						</div>
						<div className="flex items-center justify-center bg-primary rounded-xl w-[40px] h-[40px]">
							<Icon icon={"material-symbols:contract"} className="text-white text-2xl" />
						</div>
					</div>

					<div className="flex items-center justify-between p-4 bg-white rounded-lg drop-shadow-lg">
						<div>
							<p className="text-custom-light-gray">profit</p>
							<p className="font-bold">{product.sold * product.profit}</p>
						</div>
						<div className="flex items-center justify-center bg-primary rounded-xl w-[40px] h-[40px]">
							<Icon icon={"material-symbols:contract"} className="text-white text-2xl" />
						</div>
					</div>


					<div className="flex items-center justify-between p-4 bg-white rounded-lg drop-shadow-lg">
						<div>
							<p className="text-custom-light-gray">stock</p>
							<p className="font-bold">{product.stock}</p>
						</div>
						<div className="flex items-center justify-center bg-primary rounded-xl w-[40px] h-[40px]">
							<Icon icon={"material-symbols:contract"} className="text-white text-2xl" />
						</div>
					</div>

					<div className="flex items-center justify-between p-4 bg-white rounded-lg drop-shadow-lg">
						<div>
							<p className="text-custom-light-gray">value</p>
							<p className="font-bold">{product.stock * product.price}</p>
						</div>
						<div className="flex items-center justify-center bg-primary rounded-xl w-[40px] h-[40px]">
							<Icon icon={"material-symbols:contract"} className="text-white text-2xl" />
						</div>
					</div>

				</div>
			</div>

			<div className="flex items-center gap-5 h-full w-full">

				<div className="flex flex-col w-80 p-5 bg-white drop-shadow-lg rounded-lg h-full">
					<div className="flex flex-col gap-2 h-full w-full">
						<div className="flex items-center justify-between">
							<p>Name:</p>
							<p>{product.name}</p>
						</div>
						<Separator className="bg-custom-light-gray w-full" orientation="horizontal" />

						<div className="flex items-center justify-between">
							<p>Price:</p>
							<p>{product.price}</p>
						</div>
						<Separator className="bg-custom-light-gray w-full" orientation="horizontal" />

						<div className="flex items-center justify-between">
							<p>stock:</p>
							<p>{product.stock}</p>
						</div>
						<Separator className="bg-custom-light-gray w-full" orientation="horizontal" />

						<div className="flex items-center justify-between">
							<p>profit:</p>
							<p>{product.profit}</p>
						</div>
						<Separator className="bg-custom-light-gray w-full" orientation="horizontal" />

						<div className="flex items-center justify-between">
							<p>point:</p>
							<p>{product.point}</p>
						</div>
						<Separator className="bg-custom-light-gray w-full" orientation="horizontal" />

						<div className="flex items-center justify-between">
							<p>created at:</p>
							<p>{moment(product?.createdAt).format("DD/MM/YYYY")}</p>
						</div>
						<Separator className="bg-custom-light-gray w-full" orientation="horizontal" />

					</div>
					{
						<div className="flex gap-2 items-center ">
							<button onClick={e => { e.preventDefault(); toggleListing() }} className="bg-primary text-white px-6 py-2 font-bold rounded-lg">
								{product.listed ? "Unlist" : "List"}
							</button>
							<EditProduct api={vendorApi} product={product} setProduct={setProduct}>
								<div className="bg-primary text-white px-6 py-2 font-bold rounded-lg">
									Edit
								</div>
							</EditProduct>
							<YesNoModal
								title="delete this product"
								description="are you sure you want to delete this product"
								onYes={deleteProduct}
								onNo={() => { }}
							>
								<div className="bg-red-500 text-white px-6 py-2 font-bold rounded-lg">
									Delete
								</div>
							</YesNoModal>
						</div>
					}

				</div>
				<ProductGraph id={params.productId} api={vendorApi} />
			</div>
		</div>
	)
}

export default ProductView


