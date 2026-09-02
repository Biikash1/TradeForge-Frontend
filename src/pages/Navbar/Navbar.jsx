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
import { useSelector } from "react-redux";

const Navbar = () => {
  const { user } = useSelector((state) => state.auth || {});

  return (
    <nav className="sticky top-0 left-0 right-0 z-50 flex items-center justify-between border-b border-slate-800 bg-background/95 backdrop-blur px-4 py-3">
      {/* Left Area: Sheet Menu, Logo & Search */}
      <div className="flex items-center gap-3">
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-full"
              aria-label="Open Navigation Menu"
            >
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>

          <SheetContent className="w-72 flex flex-col p-4" side="left">
            <SheetHeader className="pb-4 border-b border-slate-800">
              {/* Used asChild to prevent <div> inside <h2> validation error */}
              <SheetTitle asChild>
                <div className="flex items-center justify-center gap-2 text-2xl font-bold cursor-pointer">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={cryptoImage} alt="Crypto Trade Logo" />
                    <AvatarFallback className="bg-orange-600 text-white text-xs">
                      CT
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <span className="text-orange-500">Crypto</span>
                    <span className="text-white">Trade</span>
                  </div>
                </div>
              </SheetTitle>
            </SheetHeader>
            <Sidebar />
          </SheetContent>
        </Sheet>

        <span className="text-sm lg:text-base font-semibold cursor-pointer tracking-tight">
          Crypto Trading
        </span>

        {/* Search Bar Trigger */}
        <div className="hidden sm:block ml-4">
          <Button
            variant="outline"
            className="flex items-center gap-2 text-slate-400 border-slate-700 hover:text-white"
            size="sm"
          >
            <Search className="h-4 w-4" />
            <span className="text-xs">Search assets...</span>
          </Button>
        </div>
      </div>

      {/* Right Area: User Profile Avatar */}
      <div className="flex items-center gap-3">
        {/* Mobile-only search icon */}
        <Button
          variant="ghost"
          size="icon"
          className="sm:hidden h-9 w-9 text-slate-400"
          aria-label="Search"
        >
          <Search className="h-4 w-4" />
        </Button>

        <Avatar className="h-9 w-9 border border-slate-700 cursor-pointer">
          <AvatarFallback className="bg-cyan-600 text-white font-semibold text-xs">
            {user?.fullName?.[0]?.toUpperCase() ?? "U"}
          </AvatarFallback>
        </Avatar>
      </div>
    </nav>
  );
};

export default Navbar;
