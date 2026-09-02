import { Button } from "@/components/ui/button";
import ReactApexChart from "react-apexcharts";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMarketChart } from "@/State/Coin/ActionCoin";

const timeSeries = [
  { lable: "1 Day", value: 1 },
  { lable: "1 Week", value: 7 },
  { lable: "1 Month", value: 30 },
];

const StockChart = ({ coinId = "bitcoin" }) => {
  const [activeDays, setActiveDays] = useState(1);
  const dispatch = useDispatch();

  const { marketChart } = useSelector((store) => store.coin || {});
  const chartData = marketChart?.data || [];

  useEffect(() => {
    if (coinId) {
      dispatch(fetchMarketChart({ coinId, days: activeDays }));
    }
  }, [dispatch, coinId, activeDays]);

  const series = [
    {
      name: "Price",
      data: chartData,
    },
  ];

  const options = {
    chart: {
      id: "area-datetime",
      type: "area",
      height: 350,
      toolbar: { show: false },
      zoom: { autoScaleYaxis: true },
    },
    dataLabels: { enabled: false },
    stroke: {
      curve: "smooth",
      width: 2,
      colors: ["#06b6d4"],
    },
    xaxis: {
      type: "datetime",
      tickAmount: 6,
      labels: {
        style: { colors: "#94a3b8" },
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: {
        style: { colors: "#94a3b8" },
        formatter: (val) => (val ? `$${val.toLocaleString()}` : ""),
      },
    },
    colors: ["#06b6d4"],
    markers: {
      size: 0,
      colors: ["#06b6d4"],
      strokeColors: ["#ffffff"], // Fixed: was strokeColor (caused undefined color error)
      strokeWidth: 1,
    },
    tooltip: {
      theme: "dark",
      x: { format: "dd MMM yyyy HH:mm" },
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.45,
        opacityTo: 0.05,
        stops: [0, 90, 100],
      },
    },
    grid: {
      borderColor: "#334155",
      strokeDashArray: 4,
      show: true,
    },
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {timeSeries.map((item) => (
          <Button
            key={item.lable}
            size="sm"
            variant={activeDays === item.value ? "default" : "outline"}
            onClick={() => setActiveDays(item.value)}
            className="text-xs rounded-lg"
          >
            {item.lable}
          </Button>
        ))}
      </div>

      <div id="chart-timelines" className="min-h-[350px]">
        {chartData.length > 0 ? (
          <ReactApexChart
            options={options}
            series={series}
            type="area"
            height={350}
          />
        ) : (
          <div className="h-[350px] flex items-center justify-center text-slate-500 text-sm border border-slate-800/80 rounded-xl">
            {marketChart?.loading
              ? "Loading chart..."
              : "No chart data available"}
          </div>
        )}
      </div>
    </div>
  );
};

export default StockChart;
