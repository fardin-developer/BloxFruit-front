import React from 'react'

export default function OurBestSell() {
    return (
        <div className='max-w-[1320px] mx-auto px-4 xl:px-0 mt-20'>
            <div className="mb-12 lg:flex items-center justify-between text-white">
                <h1 className="text-3xl xl:text-5xl font-medium uppercase ">
                    Our <span className="text-[#FADA1B]">best sellers</span>
                </h1>
                <div className="sm:flex justify-between items-center">
                    <div className="flex justify-between my-3 items-center">
                        <p className="text-white">
                            Total Price 90.99ETH
                        </p>
                        <span className="text-3xl px-4 text-[#2F2A38]">|</span>
                        <p className="text-white md:pr-6">
                            Total 15 Items
                        </p>
                    </div>
                    <button className="w-full sm:w-fit text-center flex items-center grad-btn hover:opacity-90 text-black px-8 py-3 font-medium text-base cursor-pointer">
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
                </div>
            </div>
        </div>
    )
}
