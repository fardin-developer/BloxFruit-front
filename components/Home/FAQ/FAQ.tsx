"use client";
import { useState } from "react";
import { LuChevronDown } from "react-icons/lu";
import Image from "next/image";
import faqImage from "@/public/faq.png";
import { IoMdArrowDropdown } from "react-icons/io";

const faqData = [
  {
    question: "Why Choose Blox Fruit Hub?",
    answer:
      "BeatProtect allows music producers to securely register their beats and obtain legal proof of ownership. Once registered, each beat receives a unique digital fingerprint and timestamp, ensuring that you can prove ownership in case of disputes. When you register a beat, BeatProtect generates a legal certificate, which serves as official proof of ownership. This certificate can be used as legal support in case of any copyright dispute on platforms like YouTube, Spotify, or any other digital service where your beat is being used without permission.",
  },
  {
    question:
      "How do I complete my purchase?",
    answer:
      "Yes! Even if your beat is already uploaded to YouTube, SoundCloud, or any other platform, you can still register it with BeatProtect. This will give you legal proof of ownership, ensuring that you can take action if someone uses your beat without permission.",
  },
  {
    question: "How Fast Is The Delivery?",
    answer:
      "With your subscription, you receive 20 credits each month (1 credit = 1 beat registration). If you need more, you can purchase additional credits at any time. Your subscription renews automatically every month, and you can manage it from your account dashboard.",
  },
  {
    question:
      "Is gifting items to a friend possible?",
    answer:
      "You can purchase packs of 10 credits for $5. This way, you can buy as many credits as you need to register and protect your beats. This is ideal for producers with large beat catalogs.",
  },
  {
    question:
      "What should I do if I haven’t received my items?",
    answer:
      "Yes! If you don't use your credits within a month, they automatically roll over to the next month. You'll never lose the credits you've paid for.",
  },
  {
    question: "What is the process for requesting a refund?",
    answer:
      "Yes, you can cancel your subscription whenever you want. Once you cancel, you’ll still have access to your registered beats, but you won’t be able to register new ones unless you resubscribe.",
  },
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="max-w-[1320px] mx-auto px-4 2 my-20">
      <div className="">
        <div className="space-y-6">
          {faqData.map((item, index) => (
            <div
              key={index}
              className={`rounded-lg shadow-lg transition transform ${openIndex === index ? "bg-[#0a0a09]":"bg-[#0c0c0d]"}`}
            >
              <button
                onClick={() => toggleAccordion(index)}
                className="w-full flex justify-between items-center text-left pl-6  text-white font-medium text-lg "
              >
                <div className="flex items-center gap-6">
                  <span className="h-8 w-8 text-base text-black font-semibold bg-gradient-to-l to-[#FADA1B] from-white rounded-full flex items-center justify-center drop-shadow-[0_0_3px_rgba(255,255,0,0.7)]">
                    {index + 1}
                  </span>
                  <span className="text-sm md:text-base">{item.question}</span>
                </div>
                <div className=" relative transform transition-transform ">
                  <Image src={faqImage} alt="faq" width={124} height={72} />
                  <IoMdArrowDropdown size={24} className={`text-[#FADA1B] absolute right-[40%] top-[40%] duration-300 ${openIndex === index ? "rotate-180":""}`} />
                </div>
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index
                    ? "max-h-96 opacity-100 py-4 px-6 text-gray-300"
                    : "max-h-0 opacity-0"
                }`}
              >
                {item.answer}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
