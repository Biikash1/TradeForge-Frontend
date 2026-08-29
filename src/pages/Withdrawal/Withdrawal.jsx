import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const Withdrawal = () => {
  return (
    <div>
      <div className="p-5 lg:p-20">
        <h1 className="font-bold text-3xl pb-5">Withdrawal</h1>
        <Table className="border">
          <TableHeader>
            <TableRow>
              <TableHead className="py-5">DATE</TableHead>
              <TableHead>METHOD</TableHead>
              <TableHead>AMOUNT</TableHead>
              <TableHead className="text-right">STATUS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1].map((item, index) => (
              <TableRow key={index}>
                <TableCell>
                  <p>June 5, 2026 at 12:00</p>
                </TableCell>
                <TableCell className="">Bank</TableCell>
                <TableCell className="">$78986</TableCell>
                <TableCell className="text-right">$500 </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Withdrawal;
