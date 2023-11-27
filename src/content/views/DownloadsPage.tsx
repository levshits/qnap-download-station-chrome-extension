import { useQnapStore } from "../../common/useQnapStore";
import { DownloadJobModel } from "../../common/QnapService";
import { useMemo } from "react";
import { Container, Table, TableData } from "@mantine/core";

function humanFileSize(size: number) {
  var i: number = size == 0 ? 0 : Math.floor(Math.log(size) / Math.log(1024));
  return (
    (size / Math.pow(1024, i)).toFixed(2) +
    " " +
    ["B", "kB", "MB", "GB", "TB"][i]
  );
}

type ColumnDefinition<TModel> = {
  header: string;
  property: keyof TModel;
  render?: (model: TModel) => React.ReactNode;
};

const columns: ColumnDefinition<DownloadJobModel>[] = [
  {
    property: "priority",
    header: "Id",
  },
  {
    property: "source_name",
    header: "Name",
  },

  {
    property: "down_rate",
    header: "Download speed",
    render: ({ down_rate }) => humanFileSize(down_rate) + "/s",
  },
  {
    property: "up_rate",
    header: "Upload speed",
    render: ({ up_rate }) => humanFileSize(up_rate) + "/s",
  },
  {
    property: "size",
    header: "Size",
    render: ({ size }) => humanFileSize(size),
  },
  {
    property: "done",
    header: "Percent Complete",
    render: ({ done, size }) =>
      (((done ?? 0) / (size ?? 100)) * 100).toFixed(2) + "%",
  },
  {
    property: "peers",
    header: "Peers",
  },
  {
    property: "create_time",
    header: "Create Time",
    render: ({ create_time }) => new Date(create_time).toLocaleDateString(),
  },
];

export function DownloadsPage() {
  const { state } = useQnapStore((x) => x.Jobs);
  const tableData: TableData = useMemo<TableData>(
    () => ({
      head: columns.map((column) => column.header),
      body: state?.map((job) => {
        return columns.map((column) => {
          return column.render ? column.render(job) : job[column.property];
        });
      }),
    }),
    [state]
  );

  return <Container fluid>
    {!!state && <Table data={tableData} stickyHeader/>}
    </Container>;
}
