import cubejs from "@cubejs-client/core";
import { QueryRenderer } from "@cubejs-client/react";
import { Spin } from "antd";
import React from "react";
import { Pie } from "react-chartjs-2";

const COLORS_SERIES = [
  "#5b8ff9",
  "#5ad8a6",
  "#5e7092",
  "#f6bd18",
  "#6f5efa",
  "#6ec8ec",
  "#945fb9",
  "#ff9845",
  "#299796",
  "#fe99c3",
];
const commonOptions = {
  maintainAspectRatio: false,
  interaction: {
    intersect: false,
  },
  plugins: {
    legend: {
      position: "bottom",
    },
  },
  scales: {
    x: {
      ticks: {
        autoSkip: true,
        maxRotation: 0,
        padding: 12,
        minRotation: 0,
      },
    },
  },
};

const useDrilldownCallback = ({
  datasets,
  labels,
  onDrilldownRequested,
  pivotConfig,
}) => {
  return React.useCallback(
    (elements) => {
      if (elements.length <= 0) return;
      const { datasetIndex, index } = elements[0];
      const { yValues } = datasets[datasetIndex];
      const xValues = [labels[index]];

      if (typeof onDrilldownRequested === "function") {
        onDrilldownRequested(
          {
            xValues,
            yValues,
          },
          pivotConfig
        );
      }
    },
    [datasets, labels, onDrilldownRequested]
  );
};

const PieChartRenderer = ({ resultSet, pivotConfig, onDrilldownRequested }) => {
  const data = {
    labels: resultSet.categories(pivotConfig).map((c) => c.x),
    datasets: resultSet.series(pivotConfig).map((s) => ({
      label: s.title,
      data: s.series.map((r) => r.value),
      yValues: [s.key],
      backgroundColor: COLORS_SERIES,
      hoverBackgroundColor: COLORS_SERIES,
    })),
  };
  const getElementAtEvent = useDrilldownCallback({
    datasets: data.datasets,
    labels: data.labels,
    pivotConfig,
    onDrilldownRequested,
  });
  return (
    <Pie
      type="pie"
      data={data}
      options={commonOptions}
      getElementAtEvent={getElementAtEvent}
    />
  );
};

const cubejsApi = cubejs(import.meta.env.VITE_CUBEJS_TOKEN, {
  apiUrl: import.meta.env.VITE_CUBEJS_API_URL,
});

const renderChart = ({
  resultSet,
  error,
  pivotConfig,
  onDrilldownRequested,
}) => {
  if (error) {
    return <div>{error.toString()}</div>;
  }

  if (!resultSet) {
    return <Spin />;
  }

  return (
    <PieChartRenderer
      resultSet={resultSet}
      pivotConfig={pivotConfig}
      onDrilldownRequested={onDrilldownRequested}
    />
  );
};

const ChartRenderer = () => {
  return (
    <QueryRenderer
      query={{
        limit: 20,
        measures: ["Gitarchive.count_repository_name"],
        order: {
          "Gitarchive.count_repository_name": "desc",
        },
        dimensions: ["Gitarchive.username"],
      }}
      cubejsApi={cubejsApi}
      resetResultSetOnChange={false}
      render={(props) =>
        renderChart({
          ...props,
          chartType: "pie",
          pivotConfig: {
            x: ["Gitarchive.username"],
            y: ["measures"],
            fillMissingDates: true,
            joinDateRange: false,
            limit: 20,
          },
        })
      }
    />
  );
};

export default ChartRenderer;
// const rootElement = document.getElementById('root');
// ReactDOM.render(<ChartRenderer />, rootElement);
