import { useState } from "react";
import { useDispatch } from "react-redux";
import { transferMoney } from "@/State/Wallet/ActionWallet";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DialogClose } from "@/components/ui/dialog";

const TransferForm = () => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    walletId: "",
    amount: "",
    purpose: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const jwt = localStorage.getItem("jwt");

    if (!formData.walletId || !formData.amount) {
      alert("Please enter recipient wallet ID and transfer amount.");
      return;
    }

    dispatch(
      transferMoney({
        jwt,
        walletId: formData.walletId,
        reqData: {
          amount: parseFloat(formData.amount),
          purpose: formData.purpose || "Wallet Transfer",
        },
      })
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 pt-2">
      <div>
        <label className="text-xs text-slate-400 font-medium">Recipient Wallet ID</label>
        <Input
          name="walletId"
          placeholder="e.g. 102"
          type="number"
          value={formData.walletId}
          onChange={handleChange}
          className="bg-slate-950/60 border-slate-800 text-white mt-1"
          required
        />
      </div>

      <div>
        <label className="text-xs text-slate-400 font-medium">Amount (USD)</label>
        <Input
          name="amount"
          placeholder="0.00"
          type="number"
          step="0.01"
          min="0.01"
          value={formData.amount}
          onChange={handleChange}
          className="bg-slate-950/60 border-slate-800 text-white mt-1"
          required
        />
      </div>

      <div>
        <label className="text-xs text-slate-400 font-medium">Purpose / Note (Optional)</label>
        <Input
          name="purpose"
          placeholder="e.g. For dinner, Project fee"
          value={formData.purpose}
          onChange={handleChange}
          className="bg-slate-950/60 border-slate-800 text-white mt-1"
        />
      </div>

      <div className="pt-2">
        <DialogClose asChild>
          <Button
            type="submit"
            className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-semibold"
          >
            Send Transfer
          </Button>
        </DialogClose>
      </div>
    </form>
  );
};

export default TransferForm;