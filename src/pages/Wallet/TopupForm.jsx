import { Input } from "@/components/ui/input";
import { useState } from "react";

const TopupForm = () => {

    const [amount, setAmount] = useState("");
    const handleChange = (e) => {
        setAmount(e.target.value)
    }

    return (
        <div className="pt-10 space-y-5">

            <div>
                <h1 className="pb-1">Enter Amount</h1>
                <Input 
                onChange={handleChange}
                value={amount}
                 className="py-7 text-lg"
                 placeholder="$9999"
                />
            </div>

        </div>
    )
}

export default TopupForm;