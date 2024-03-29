import { useMemo } from "react";
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
        entryId: string;
        date: string;
        weight: number | null | undefined;
        reps: number | null | undefined;
        sets: number | null | undefined;
      } | null)[];
}

interface MergedData {
  entryId?: string | undefined;
  date?: string;
  avgWeight: number | null | undefined;
  totalReps: number | null | undefined;
  totalWeight: number | null | undefined;
  weight?: number | null | undefined;
  reps?: number | null | undefined;
  sets?: number | null | undefined;
}

const FieldLineChart: React.FC<ChartProps> = ({ data }) => {
  const filteredData = data.filter((entry) => entry);
  const mergedData = useMemo(() => {
    return computeChartsData(filteredData);
  }, [filteredData]);

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart
        width={500}
        height={300}
        data={mergedData}
        margin={{
          top: 5,
          right: 30,
          left: 0,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip
        labelClassName="text-neutral-800"
        />
        <Legend />
        {mergedData.length && (
          <>
            <Line
              name="Weight Average"
              type="monotone"
              dataKey="avgWeight"
              stroke="#a3e635"
              activeDot={{ r: 8 }}
            />
            <Line
              name="Total Repetitions"
              type="monotone"
              dataKey="totalReps"
              stroke="#f97316"
            />
          </>
        )}
      </LineChart>
    </ResponsiveContainer>
  );
};

function computeChartsData(data: ChartProps["data"]) {
  const newMergedData: MergedData[] = [];

  for (let i = 0; i < data.length; i++) {
    const row = data[i];
    const previousData = newMergedData[newMergedData.length - 1];

    if (!row?.reps || !row?.sets || !row?.weight) continue;

    const totalRepsFormula = row?.reps * row?.sets;
    const totalWeightFormula = row?.weight * totalRepsFormula;
    const avgWeightFormula = totalWeightFormula / totalRepsFormula;

    if (
      row?.entryId === previousData?.entryId &&
      previousData?.totalReps &&
      previousData?.totalWeight
    ) {
      const totalReps = totalRepsFormula + previousData.totalReps;
      const totalWeight = totalWeightFormula + previousData.totalWeight;
      const avgWeight = totalWeight / totalReps;
      const updatedRow = {
        ...previousData,
        totalReps,
        totalWeight,
        avgWeight: Math.floor(avgWeight),
      };
      newMergedData[newMergedData.length - 1] = updatedRow;
    } else {
      const newRow = {
        entryId: row?.entryId,
        date: row?.date,
        totalReps: totalRepsFormula,
        totalWeight: totalWeightFormula,
        avgWeight: avgWeightFormula,
      };
      newMergedData.push(newRow);
    }
  }
  return newMergedData;
}

export default FieldLineChart;
