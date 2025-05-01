import MainCard from '@/components/ui/MainCard/MainCard'
import rare from "@/public/mainCardImages/rare.png";
import legendary from "@/public/mainCardImages/legendary.png";
import uncommon from "@/public/mainCardImages/uncommon.png";
import mythical from "@/public/mainCardImages/mythical.png";
import common from "@/public/mainCardImages/common.png";



const cardData = [
    {
        "type": "rare",
        "name": "BarrierFruit",
        "regularPrice": 17.89,
        "discountPrice": 10.23,
        "image": rare,
        "category": "Permanent Fruit"
    },
    {
        "type": "legendary",
        "name": "RubberFruit",
        "regularPrice": 15.49,
        "discountPrice": 7.79,
        "image": legendary,
        "category": "Permanent Fruit"
    },
    {
        "type": "uncommon",
        "name": "IceFruit",
        "regularPrice": 9.99,
        "discountPrice": 4.89,
        "image": uncommon,
        "category": "Permanent Fruit"
    },
    {
        "type": "mythical",
        "name": "SandFruit",
        "regularPrice": 9.99,
        "discountPrice": 4.89,
        "image": mythical,
        "category": "Permanent Fruit"
    },
    {
        "type": "common",
        "name": "BuddhaFruit",
        "regularPrice": 10.23,
        "discountPrice": 4.5,
        "image": common,
        "category": "Permanent Fruit"
    },
    {
        "type": "mythical",
        "name": "SandFruit",
        "regularPrice": 9.99,
        "discountPrice": 4.89,
        "image": mythical,
        "category": "Permanent Fruit"
    },
    {
        "type": "rare",
        "name": "BarrierFruit",
        "regularPrice": 17.89,
        "discountPrice": 10.23,
        "image": rare,
        "category": "Permanent Fruit"
    },
    {
        "type": "uncommon",
        "name": "IceFruit",
        "regularPrice": 9.99,
        "discountPrice": 4.89,
        "image": uncommon,
        "category": "Permanent Fruit"
    }
];



export default function OurBestSell() {
    console.log(cardData);
    return (
        <div className='max-w-[1320px] mx-auto px-4 2xl:px-0 mt-20'>
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
                    <button className="w-full sm:w-fit text-center  flex justify-center items-center grad-btn hover:opacity-90 text-black px-8 py-3 font-medium text-base cursor-pointer">
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {
                    cardData.map((item, index) => (
                        <MainCard key={index} data={item} />
                    ))
                }
            </div>
        </div>
    )
}
