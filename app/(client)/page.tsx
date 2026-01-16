import Hero from "@/components/Home/Hero/Hero";
import OurGames from "@/components/Home/OurGames/OurGames";
import WhyChoose from "@/components/Home/WhyChoose/WhyChoose";
import FAQ from "@/components/Home/FAQ/FAQ";

const page = () => {
  return (
    <div className="fade-in">
      <Hero />
      <WhyChoose />
      <OurGames />
      <FAQ />
    </div>
  );
};

export default page;
