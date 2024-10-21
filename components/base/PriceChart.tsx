import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Filler,
    Legend,
    Decimation,
} from "chart.js";
import moment from "moment";
import axios from "axios";
import { useState, useEffect } from "react";
import { BASE_URL } from "../../utils/keys";
import { PriceChartProps } from "../rebalance/types";
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler, Legend, Decimation);

interface CoinChartData {
    x: number;
    y: string;
}

const PriceChart: React.FC<PriceChartProps> = ({ id }) => {
    const [data, setData] = useState<any>(null);
    const [filter, setFilter] = useState("365"); // Default is 1 year

    const getData = async (days: string) => {
        try {
            const response = await axios.get(`${BASE_URL}/swap/chart?id=${id}&days=${days}`);
            setData(response.data);
        } catch (error) {
            console.error("Error fetching coin data:", error);
        }
    };

    useEffect(() => {
        getData(filter);
    }, [filter]);

    if (!data) {
        return <div className={`animate-pulse h-full w-full mb-10 bg-zinc-800 rounded-xl`}></div>;
    }

    const coinChartData: CoinChartData[] = data?.prices?.map((value: any) => ({
        x: value[0],
        y: value[1].toFixed(2),
    }));

    const options: any = {
        
    };

    const chartData = {
        labels: coinChartData.map((value) => moment(value.x).format("MMM DD YY")),
        datasets: [
            {
                fill: false,
                label: id.toUpperCase(),
                data: coinChartData.map((val) => val.y),
            },
        ],
    };

    // Custom plugin to draw vertical line on hover
    const verticalLinePlugin = {
        id: "verticalLinePlugin",
        afterDraw: (chart: any) => {
            if (chart.tooltip._active && chart.tooltip._active.length) {
                const ctx = chart.ctx;
                const activePoint = chart.tooltip._active[0];
                const x = activePoint.element.x;
                const topY = chart.scales.y.top;
                const bottomY = chart.scales.y.bottom;

                // Draw vertical line
                ctx.save();
                ctx.beginPath();
                ctx.moveTo(x, topY);
                ctx.lineTo(x, bottomY);
                ctx.lineWidth = 1;
                ctx.strokeStyle = "rgba(255, 255, 255, 0.4)"; // White color for the vertical line
                ctx.stroke();
                ctx.restore();
            }
        },
    };

    return (
        <div className="">
            <div className="flex gap-4 mb-4 h-8">
                <button
                    onClick={() => setFilter("365")}
                    className={`px-2 py-1 text-sm ${
                        filter === "365" ? "bg-zinc-800 border border-zinc-700" : "bg-zinc-900 border border-zinc-700"
                    } rounded`}
                >
                    1 Year
                </button>
                <button
                    onClick={() => setFilter("180")}
                    className={`px-2 py-1 text-sm ${
                        filter === "180" ? "bg-zinc-800 border border-zinc-700" : "bg-zinc-900 border border-zinc-700"
                    } rounded`}
                >
                    6 Months
                </button>
                <button
                    onClick={() => setFilter("30")}
                    className={`px-2 py-1 text-sm ${
                        filter === "30" ? "bg-zinc-800 border border-zinc-700" : "bg-zinc-900 border border-zinc-700"
                    } rounded`}
                >
                    1 Month
                </button>
                <button
                    onClick={() => setFilter("7")}
                    className={`px-2 py-1 text-sm ${
                        filter === "7" ? "bg-zinc-800 border border-zinc-700" : "bg-zinc-900 border border-zinc-700"
                    } rounded`}
                >
                    1 Week
                </button>
                <button
                    onClick={() => setFilter("1")}
                    className={`px-2 py-1 text-sm ${
                        filter === "1" ? "bg-zinc-800 border border-zinc-700" : "bg-zinc-900 border border-zinc-700"
                    } rounded`}
                >
                    Today
                </button>
            </div>
            <Line options={options} data={chartData} plugins={[verticalLinePlugin]} />
        </div>
    );
};

export default PriceChart;
