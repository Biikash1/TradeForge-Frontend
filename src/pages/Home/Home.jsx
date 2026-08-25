import { Button } from "@/components/ui/button";
import { useState } from "react";
import AssetTable from "./AssetTable";

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
          <AssetTable/>
        </div>
      </div>
    </div>
  );
};

export default Home;
