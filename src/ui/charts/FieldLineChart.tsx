import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface ChartProps {
  data:
    | ({
        date: string;
        weight: number | null | undefined;
        reps: number | null | undefined;
        sets: number | null | undefined;
      } | null)[]
    | undefined;
}

const FieldLineChart: React.FC<ChartProps> = ({ data }) => {
  const filteredData = data?.filter((entry) => entry);
  console.log(data);
  console.log(filteredData);

  return (
    <ResponsiveContainer width="100%" height={400}>
    <LineChart
      width={500}
      height={300}
      data={filteredData}
      margin={{
        top: 5,
        right: 30,
        left: 0,
        bottom: 5,
      }}
      
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="date" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Line
        type="monotone"
        dataKey="weight"
        stroke="#8884d8"
        activeDot={{ r: 8 }}
      />
      <Line type="monotone" dataKey="reps" stroke="#82ca9d" />
      <Line type="monotone" dataKey="sets" stroke="#f2ca9d" />
    </LineChart>
    </ResponsiveContainer>
  );
};

export default FieldLineChart;
