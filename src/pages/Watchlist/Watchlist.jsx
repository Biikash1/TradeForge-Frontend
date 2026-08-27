import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import btc from "@/assets/btc.png"
import { Button } from "@/components/ui/button";
import { BookmarkFilledIcon } from "@radix-ui/react-icons";

const Watchlist = () => {

    const handleRemoveToWatchlist=(value) => {
        console.log(value)
    }

    return (
         <div className="p-5 lg:p-20">
        <h1 className="font-bold text-3xl pb-5">Watchlist</h1>
      <Table className="border">
        <TableHeader>
          <TableRow>
            <TableHead className="py-5">COIN</TableHead>
            <TableHead>SYMBOL</TableHead>
            <TableHead>VOLUME</TableHead>
            <TableHead>MARKET CAP</TableHead>
            <TableHead>24H</TableHead>
            <TableHead className="">PRICE</TableHead>
             <TableHead className="text-right text-red-600">REMOVE</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1].map((item, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium flex items-center gap-2">
                <Avatar className="-z-50">
                  <AvatarImage src={btc} />
                </Avatar>
                <span>Bitcoin</span>
              </TableCell>
              <TableCell>BTC</TableCell>
              <TableCell>53765825355</TableCell>
              <TableCell>1585855827988</TableCell>
              <TableCell>-0.1674</TableCell>
              <TableCell className="">$78986</TableCell>
              <TableCell className="text-right">
                <Button 
                variant="ghost"
                 onClick={()=> handleRemoveToWatchlist(item.id)}
                size="icon" className="h-10 w-10">
                    <BookmarkFilledIcon className="w-6 h-6"/>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
    )
}

export default Watchlist;