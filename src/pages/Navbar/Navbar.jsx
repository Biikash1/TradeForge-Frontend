import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu, Search } from "lucide-react";
import cryptoImage from "@/assets/cryptoImage.png";
import Sidebar from "./Sidebar";

const Navbar = () => {
  return (
    <div className="sticky top-0 left-0 right-0 z-50 flex items-center justify-between border-b bg-background px-2 py-3">
      <div className="flex items-center gap-3">
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-11 w-11 rounded-full"
            >
              <Menu className="h-7 w-7" />
            </Button>
          </SheetTrigger>

          <SheetContent className="w-72 border-r-0 flex flex-col" side="left">
            <SheetHeader>
              <SheetTitle>
                <div className="flex items-center justify-center gap-2 text-3xl">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={cryptoImage} />
                  </Avatar>
                  <div>
                    <span className="font-bold text-orange-700">Crypto</span>
                    <span>Trade</span>
                  </div>
                </div>
              </SheetTitle>
            </SheetHeader>
            <Sidebar />
          </SheetContent>
        </Sheet>
        <p className="text-sm lg:text-base cursor-pointer">Crypto Trading</p>
        <div className="p-0 ml-9">
          <Button variant="outline" className="flex items-center gap-3">
            <Search className="h-5 w-5" />
            <span>Search</span>
          </Button>
        </div>
      </div>
      <div>
        <Avatar>
          <AvatarFallback>B</AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
};

export default Navbar;
