import "./chart.scss";
import {
  AreaChart,
  Area,
  XAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";


const dataYearly = [
  { name: "January", Total: 1200 },
  { name: "February", Total: 2100 },
  { name: "March", Total: 800 },
  { name: "April", Total: 1600 },
  { name: "May", Total: 900 },
  { name: "June", Total: 1700 },
  { name: "July", Total: 1700 },
  { name: "August", Total: 1700 },
  { name: "September", Total: 1700 },
  { name: "October", Total: 1700 },
  { name: "November", Total: 1700 },
  { name: "December", Total: 1700 },
];
const dataMonthly = [
  {name:'1',Total:100},
  {name:'2',Total:100},
  {name:'3',Total:100}
]
const dataWeekly =[
  {name:'Monday',Total:104},
  {name:'Tuesday',Total:120},
  {name:'Wednesday',Total:1500},
  {name:'Thursday',Total:110},
  {name:'Friday',Total:104},
  {name:'Saturday',Total:1523},
  {name:'Sunday',Total:1120}
]

const Chart = ({ aspect, title }) => {
  
  return (
    <div className="chart">
      <div className="title">{title}</div>
      <ResponsiveContainer width="100%" aspect={aspect}>
        <AreaChart
          width={730}
          height={250}
          data={dataWeekly}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="total" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="name" stroke="gray" />
          <CartesianGrid strokeDasharray="3 3" className="chartGrid" />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="Total"
            stroke="#8884d8"
            fillOpacity={1}
            fill="url(#total)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Chart;
