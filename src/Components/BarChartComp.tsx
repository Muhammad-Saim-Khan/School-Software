import * as React from "react";
import Stack from "@mui/material/Stack";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import { BarChart } from "@mui/x-charts/BarChart";
import { axisClasses } from "@mui/x-charts/ChartsAxis";

type TickParamsSelectorProps = {
  tickPlacement: "end" | "start" | "middle" | "extremities";
  tickLabelPlacement: "tick" | "middle";
  setTickPlacement: React.Dispatch<
    React.SetStateAction<"end" | "start" | "middle" | "extremities">
  >;
  setTickLabelPlacement: React.Dispatch<
    React.SetStateAction<"tick" | "middle">
  >;
};

TickParamsSelector;
function TickParamsSelector({
  tickPlacement,
  tickLabelPlacement,
  setTickPlacement,
  setTickLabelPlacement,
}: TickParamsSelectorProps) {
  return (
    <Stack
      direction="column"
      justifyContent="space-between"
      sx={{ width: "100%" }}
    >
      <FormControl>
        <FormLabel id="tick-placement-radio-buttons-group-label">
          tickPlacement
        </FormLabel>
        <RadioGroup
          row
          aria-labelledby="tick-placement-radio-buttons-group-label"
          name="tick-placement"
          value={tickPlacement}
          onChange={(event) =>
            setTickPlacement(
              event.target.value as "start" | "end" | "middle" | "extremities"
            )
          }
        >
          <FormControlLabel value="start" control={<Radio />} label="start" />
          <FormControlLabel value="end" control={<Radio />} label="end" />
          <FormControlLabel value="middle" control={<Radio />} label="middle" />
          <FormControlLabel
            value="extremities"
            control={<Radio />}
            label="extremities"
          />
        </RadioGroup>
      </FormControl>
      <FormControl>
        <FormLabel id="label-placement-radio-buttons-group-label">
          tickLabelPlacement
        </FormLabel>
        <RadioGroup
          row
          aria-labelledby="label-placement-radio-buttons-group-label"
          name="label-placement"
          value={tickLabelPlacement}
          onChange={(event) =>
            setTickLabelPlacement(event.target.value as "tick" | "middle")
          }
        >
          <FormControlLabel value="tick" control={<Radio />} label="tick" />
          <FormControlLabel value="middle" control={<Radio />} label="middle" />
        </RadioGroup>
      </FormControl>
    </Stack>
  );
}

const valueFormatter = (value: number | null) => `${value} Rs`;

const chartSetting = {
  yAxis: [
    {
      label: "",
    },
  ],
  series: [{ dataKey: "totalFees", label: "Total Fees", valueFormatter }],
  height: 500,
  sx: {
    [`& .${axisClasses.directionY} .${axisClasses.label}`]: {
      transform: "translateX(-14px)",
    },
  },
};

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const initialData = months.map((month) => ({ month, totalFees: 0 }));

export default function BarChartComp(props: any) {
  const [tickPlacement] = React.useState<"middle">("middle");
  const [tickLabelPlacement] = React.useState<"middle">("middle");
  const [chartData, setChartData] = React.useState(initialData);

  React.useEffect(() => {
    const year = new Date().getFullYear();
    const paidStudents = months.map((month: any) => {
      const totalFeesForMonth = props.allStudentsData.reduce(
        (sum: number, item: any) => {
          const feeExists =
            item.FeeDetails &&
            item.FeeDetails[year] &&
            item.FeeDetails[year][month];
          const studentFees = parseFloat(item.StudentFees) || 0;
          return feeExists && item.FeeDetails[year][month] === "Paid"
            ? sum + studentFees
            : sum;
        },
        0
      );

      return {
        month,
        totalFees: totalFeesForMonth,
      };
    });

    setChartData(paidStudents);
  }, [props.allStudentsData]);

  return (
    <div style={{ width: "100%" }}>
      <BarChart
        dataset={chartData}
        xAxis={[
          {
            scaleType: "band",
            dataKey: "month",
            tickPlacement,
            tickLabelPlacement,
          },
        ]}
        {...chartSetting}
      />
    </div>
  );
}
