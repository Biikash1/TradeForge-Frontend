import React, { useEffect, useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import { fetchPreTradeInsight } from "@/services/chatService";

const OrderConfirmationModal = ({ isOpen, onClose, onConfirm, orderDetails }) => {
  const [insight, setInsight] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      setInsight("");
      // Fetch AI Insight when the modal opens
      fetchPreTradeInsight(
        orderDetails.coinId,
        orderDetails.quantity,
        orderDetails.orderType
      )
        .then((data) => {
          setInsight(data);
          setIsLoading(false);
        })
        .catch((err) => {
          console.error("AI Insight failed to load", err);
          setInsight(
            "Unable to generate AI risk analysis at this time. Please proceed with standard caution."
          );
          setIsLoading(false);
        });
    }
  }, [isOpen, orderDetails]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl relative z-[70]">
        <h2 className="text-xl font-bold text-white mb-4">Review Order</h2>

        {/* Order Summary Section */}
        <div className="bg-slate-950/60 rounded-xl p-4 mb-4 flex justify-between items-center border border-slate-800">
          <div>
            <p className="text-slate-400 text-sm">Action</p>
            <p className="text-white font-semibold text-lg">
              {orderDetails.orderType === "BUY" ? "Buy" : "Sell"}{" "}
              {orderDetails.symbol.toUpperCase()}
            </p>
          </div>
          <div className="text-right">
            <p className="text-slate-400 text-sm">Quantity</p>
            <p className="text-cyan-400 font-mono font-semibold text-lg">
              {orderDetails.quantity}
            </p>
          </div>
        </div>
        
        <div className="flex justify-between items-center mb-6 px-1">
            <span className="text-sm text-slate-400">Total Value</span>
            <span className="font-bold text-slate-100">${orderDetails.amount}</span>
        </div>

        {/* AI Pre-Trade Insight Section */}
        <div className="relative overflow-hidden rounded-xl border border-indigo-500/30 bg-indigo-900/10 p-5 mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-5 h-5 text-indigo-400" />
            <h3 className="font-semibold text-indigo-300">AI Risk Insight</h3>
          </div>

          {isLoading ? (
            <div className="animate-pulse space-y-2 pt-1">
              <div className="h-4 bg-indigo-500/20 rounded w-full"></div>
              <div className="h-4 bg-indigo-500/20 rounded w-5/6"></div>
              <div className="h-4 bg-indigo-500/20 rounded w-4/6"></div>
            </div>
          ) : (
            <p className="text-slate-300 text-sm leading-relaxed">
              {insight}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 rounded-xl font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 px-4 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-md transition-all flex justify-center items-center"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" /> Processing
              </span>
            ) : (
              "Confirm Trade"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationModal;