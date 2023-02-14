import cubejs from "@cubejs-client/core";
import { QueryRenderer } from "@cubejs-client/react";
import { Spin } from "antd";
import "antd/dist/antd.css";
import React from "react";
import { useDeepCompareMemo } from "use-deep-compare";
import { Table } from "antd";

const cubejsApi = cubejs(import.meta.env.VITE_CUBEJS_TOKEN, {
  apiUrl: import.meta.env.VITE_CUBEJS_API_URL,
});

const formatTableData = (columns, data) => {
  function flatten(columns = []) {
    return columns.reduce((memo, column) => {
      if (column.children) {
        return [...memo, ...flatten(column.children)];
      }

      return [...memo, column];
    }, []);
  }

  const typeByIndex = flatten(columns).reduce((memo, column) => {
    return { ...memo, [column.dataIndex]: column };
  }, {});

  function formatValue(value, { type, format } = {}) {
    if (value == undefined) {
      return value;
    }

    if (type === "boolean") {
      if (typeof value === "boolean") {
        return value.toString();
      } else if (typeof value === "number") {
        return Boolean(value).toString();
      }

      return value;
    }

    if (type === "number" && format === "percent") {
      return [parseFloat(value).toFixed(2), "%"].join("");
    }

    return value.toString();
  }

  function format(row) {
    return Object.fromEntries(
      Object.entries(row).map(([dataIndex, value]) => {
        return [dataIndex, formatValue(value, typeByIndex[dataIndex])];
      })
    );
  }

  return data.map(format);
};

const TableRenderer = ({ resultSet, pivotConfig }) => {
  const [tableColumns, dataSource] = useDeepCompareMemo(() => {
    const columns = resultSet.tableColumns(pivotConfig);
    return [
      columns,
      formatTableData(columns, resultSet.tablePivot(pivotConfig)),
    ];
  }, [resultSet, pivotConfig]);
  return (
    <Table pagination={false} columns={tableColumns} dataSource={dataSource} />
  );
};

const renderChart = ({ resultSet, error, pivotConfig }) => {
  if (error) {
    return <div>{error.toString()}</div>;
  }

  if (!resultSet) {
    return <Spin />;
  }

  return <TableRenderer resultSet={resultSet} pivotConfig={pivotConfig} />;
};

const ChartRenderer = () => {
  return (
    <QueryRenderer
      query={{
        limit: 20,
        dimensions: ["BotYear.eventYear", "BotYear.botsTotal"],
        order: {
          "BotYear.count": "desc",
        },
      }}
      cubejsApi={cubejsApi}
      resetResultSetOnChange={false}
      render={(props) =>
        renderChart({
          ...props,
          chartType: "table",
          pivotConfig: {
            x: ["BotYear.eventYear", "BotYear.botsTotal"],
            y: [],
            fillMissingDates: true,
            joinDateRange: false,
          },
        })
      }
    />
  );
};

export default ChartRenderer;
