import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import btc from "@/assets/btc.png";

const Portfolio = () => {
  return (
    <div className="p-5 lg:p-20">
      <h1 className="font-bold text-3xl pb-5">Portfolio</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="">ASSETS</TableHead>
            <TableHead>PRICE</TableHead>
            <TableHead>UNIT</TableHead>
            <TableHead>CHANGE</TableHead>
            <TableHead>CHANGE%</TableHead>
            <TableHead className="text-right">VOLUME</TableHead>
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
              <TableCell className="text-right">$78986</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default Portfolio;
