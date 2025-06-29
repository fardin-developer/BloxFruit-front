"use client"
import { useGetProductsQuery } from '@/app/store/api/services/productApi';
import Loading from '@/components/Loading/Loading';
import MainCard from '@/components/ui/MainCard/MainCard'

export default function OurBestSell() {
    const { data: products, isLoading } = useGetProductsQuery();
    const data = products?.data?.filter(item => item.category === "Permanent Fruit");


    return (
        <div id="permanent" className='max-w-[1320px] mx-auto px-4 2 mt-20'>
            <div className="mb-12 lg:flex items-center justify-between text-white">
                <h1 className="text-3xl xl:text-5xl font-medium uppercase ">
                    Our <span className="text-[#FADA1B]">best sellers</span>
                </h1>
                {/* <div className="sm:flex justify-between items-center">
                    <div className="flex justify-between my-3 items-center">
                        <p className="text-white">
                            Total Price $90.99
                        </p>
                        <span className="text-3xl px-4 text-[#2F2A38]">|</span>
                        <p className="text-white md:pr-6">
                            Total 15 Items
                        </p>
                    </div>
                    <button className="w-full sm:w-fit text-center  flex justify-center items-center grad-btn hover:opacity-90 text-black px-8 py-3 font-medium text-base cursor-pointer duration-300 hover:brightness-150">
                        Get Started!
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            className="ml-2"
                        >
                            <path
                                d="M4 11V13H16V15H18V13H20V11H18V9H16V11H4ZM14 7H16V9H14V7ZM14 7H12V5H14V7ZM14 17H16V15H14V17ZM14 17H12V19H14V17Z"
                                fill="#0F1016"
                            />
                        </svg>
                    </button>
                </div> */}
            </div>
            {
                isLoading ? <Loading /> :
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {
                            data?.length > 0 ? (
                                data?.slice(0, 20).map((item, index) => (
                                    <MainCard key={index} data={item} />
                                ))
                            ) : (
                                <div className="flex justify-center items-center h-96 w-full col-span-full">
                                    <h2 className="text-2xl font-semibold text-white text-center">No data found</h2>
                                </div>
                            )
                        }
                    </div>
            }
        </div>
    )
}
