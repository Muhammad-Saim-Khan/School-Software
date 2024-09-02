import { PieChart } from '@mui/x-charts/PieChart';
import { useEffect, useState } from 'react';

export default function PieChartComp(props: any) {
    const { allStudentsData } = props
    const [data, setData] = useState<any>(false)

    useEffect(() => {
        if (allStudentsData.length > 0) {
            let maleCount = 0;
            let femaleCount = 0;

            allStudentsData.forEach((item: any) => {
                if (item.StudentGender === "Male") {
                    maleCount += 1;
                } else if (item.StudentGender === "Female") {
                    femaleCount += 1;
                }
            });

            setData([
                { id: 0, value: maleCount, label: 'Male Students', color: 'rgb(69, 201, 244)' },
                { id: 1, value: femaleCount, label: 'Female Students', color: 'hotpink' },
            ]);
        }
    }, [allStudentsData]);

    return (
        <>
            {data &&
                <PieChart
                    series={[
                        {
                            data,
                            highlightScope: { faded: 'global', highlighted: 'item' },
                            faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
                        },
                    ]}
                    height={200}
                />
            }
        </>
    );
}
