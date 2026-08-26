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

const AssetTable = () => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">COIN</TableHead>
          <TableHead>SYMBOL</TableHead>
          <TableHead>VOLUME</TableHead>
          <TableHead>MARKET CAP</TableHead>
          <TableHead>24h</TableHead>
          <TableHead className="text-right">PRICE</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {[1,1,1,1,1,1,1,1,1,1,1,1,1].map((item, index) => <TableRow key={index}>
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
          <TableCell className="text-right">$78986</TableCell>
        </TableRow>)}
      </TableBody>
    </Table>
  );
};

export default AssetTable;
