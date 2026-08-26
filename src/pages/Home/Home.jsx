import { Button } from "@/components/ui/button";
import { useState } from "react";
import AssetTable from "./AssetTable";
import StockChart from "./StockChart";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import eth from "@/assets/eth.png";
import { DotIcon, MessageCircle } from "lucide-react";

const Home = () => {
  const [category, setCategory] = useState("all");

  const handlecategory = (value) => {
    setCategory(value);
  };

  return (
    <div className="relative">
      <div className="lg:flex">
        <div className="lg:w-1/2 lg:border-r">
          <div className="p-3 flex items-center gap-4">
            <Button
              onClick={() => handlecategory("all")}
              variant={category === "all" ? "default" : "outline"}
              className="rounded-full"
            >
              All
            </Button>

            <Button
              onClick={() => handlecategory("top50")}
              variant={category === "top50" ? "default" : "outline"}
              className="rounded-full"
            >
              Top 50
            </Button>

            <Button
              onClick={() => handlecategory("topGainers")}
              variant={category === "topGainers" ? "default" : "outline"}
              className="rounded-full"
            >
              Top Gainers
            </Button>

            <Button
              onClick={() => handlecategory("topLosers")}
              variant={category === "topLosers" ? "default" : "outline"}
              className="rounded-full"
            >
              Top Losers
            </Button>
          </div>
          <AssetTable />
        </div>
        <div className="hidden lg:block lg:w-1/2 p-5">
          <StockChart />

          <div className="flex gap-5 items-center">
            <div>
              <Avatar>
                <AvatarImage src={eth} />
              </Avatar>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p>ETH</p>
                <DotIcon className="text-gray-400" />
                <p className="text-gray-400">Ethereum</p>
              </div>
              <div className="flex items-end gap-2">
                <p className="text-xl font-bold">5464</p>
                <p className="text-red-600">
                  <span>-1319049822.578</span>
                  <span>(-0.29803)</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <section className="absolute bottom-5 right-5 z-40 flex flex-col justify-end items-end gap-2">
  <div className="relative w-[10rem] cursor-pointer group">
    <Button className="w-full h-[3rem] gap-2 items-center">
      <MessageCircle
        size={30}
        className="fill-[#1e293b] -rotate-90 stroke-none group-hover:fill-[#1a1a1a]"
      />
      <span className="text-2xl">AI Assistant</span>
    </Button>
  </div>
</section>
    </div>
  );
};

export default Home;
