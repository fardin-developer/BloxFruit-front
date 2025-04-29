import Hero from "@/components/Home/Hero/Hero";
import OurGames from "@/components/Home/OurGames/OurGames";
import OurBestSell from "@/components/Home/OurBestSell/OurBestSell";
import React from "react";

const page = () => {
  return (
    <div>
      <Hero />
      <OurGames />
      <OurBestSell />
    </div>
  );
};

export default page;
