import cubejs from "@cubejs-client/core";
import { QueryRenderer } from "@cubejs-client/react";
import { Spin } from "antd";

import React from "react";
import { Table } from "antd";
import { useDeepCompareMemo } from "use-deep-compare";

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

const cubejsApi = cubejs(import.meta.env.VITE_CUBEJS_TOKEN, {
  apiUrl: import.meta.env.VITE_CUBEJS_API_URL,
});

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
      key={"pie-example-1"}
      query={{
        limit: 5,
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
          chartType: "table",
          pivotConfig: {
            x: ["Gitarchive.username"],
            y: ["measures"],
            fillMissingDates: true,
            joinDateRange: false,
            limit: 5,
          },
        })
      }
    />
  );
};

export default ChartRenderer;
