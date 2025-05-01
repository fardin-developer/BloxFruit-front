import Hero from "@/components/Home/Hero/Hero";
import OurGames from "@/components/Home/OurGames/OurGames";
import OurBestSell from "@/components/Home/OurBestSell/OurBestSell";
import WhyChoose from "@/components/Home/WhyChoose/WhyChoose";
import React from "react";

const page = () => {
  return (
    <div>
      <Hero />
      <WhyChoose />
      <OurGames />
      <OurBestSell />
    </div>
  );
};

export default page;
