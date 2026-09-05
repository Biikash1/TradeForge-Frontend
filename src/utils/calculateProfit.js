export const calculateProfit = (order) => {
  if (order && order.orderItem?.buyPrice && order.orderItem?.sellPrice) {
    const profit = order.orderItem.sellPrice - order.orderItem.buyPrice;
    return profit >= 0
      ? `+$${profit.toFixed(2)}`
      : `-$${Math.abs(profit).toFixed(2)}`;
  }
  return "-";
};

export default calculateProfit;