import { useQnapStore } from "../../common/useQnapStore";
import {
  DownloadJobModel,
  DownloadJobState,
  qnapService,
} from "../../common/QnapService";
import { useMemo, useState } from "react";
import { ActionIcon, Container, Group } from "@mantine/core";
import {
  DataTable,
  DataTableColumn,
  DataTableSortStatus,
} from "mantine-datatable";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { QnapConnectionString } from "../../common/Models";
import {
  IconPlayerPlay,
  IconPlayerStop,
  IconTrashX,
} from "@tabler/icons-react";
import { modals } from "@mantine/modals";

function humanFileSize(size: number) {
  var i: number = size == 0 ? 0 : Math.floor(Math.log(size) / Math.log(1024));
  return (
    (size / Math.pow(1024, i)).toFixed(2) +
    " " +
    ["B", "kB", "MB", "GB", "TB"][i]
  );
}

const dataTableColumns: DataTableColumn<DownloadJobModel>[] = [
  {
    accessor: "priority",
    title: "Id",
    sortable: true,
  },
  {
    accessor: "source",
    title: "Name",
    sortable: true,
  },
  {
    accessor: "state",
    title: "Name",
    render: ({ state }) => {
      switch (state) {
        case DownloadJobState.Draft:
          return "Draft";
        case DownloadJobState.Downloading:
          return "Downloading";
        case DownloadJobState.Completed:
          return "Completed";
        case DownloadJobState.Stopped:
          return "Stopped";
        case DownloadJobState.Seeding:
          return "Seeding";
        default:
          return `Unknows - ${state}`;
      }
    },
  },
  {
    accessor: "down_rate",
    title: "Download speed",
    render: ({ down_rate }) => humanFileSize(down_rate) + "/s",
    sortable: true,
  },
  {
    accessor: "up_rate",
    title: "Upload speed",
    render: ({ up_rate }) => humanFileSize(up_rate) + "/s",
    sortable: true,
  },
  {
    accessor: "size",
    title: "Size",
    render: ({ size }) => humanFileSize(size),
    sortable: true,
  },
  {
    accessor: "progress",
    title: "Percent Complete",
    render: ({ done, size }) =>
      (((done ?? 0) / (size ?? 100)) * 100).toFixed(2) + "%",
    sortable: true,
  },
  {
    accessor: "peers",
    title: "Peers",
  },
  {
    accessor: "create_time",
    title: "Create Time",
    render: ({ create_time }) => new Date(create_time).toLocaleDateString(),
    sortable: true,
  },
];

const PAGE_SIZE = 15;

export function DownloadsPage() {
  const { state: connectionSettings } = useQnapStore(
    (x) => x.NasConnectionSettings
  );
  const { state: connectionInfo } = useQnapStore((x) => x.ConnectionInfo);

  const queryClient = useQueryClient();

  const [sortStatus, setSortStatus] = useState<
    DataTableSortStatus<DownloadJobModel>
  >({
    columnAccessor: "priority",
    direction: "asc",
  });

  const [page, setPage] = useState(1);

  const { data, isFetching } = useQuery({
    queryKey: ["jobs", sortStatus, page],
    queryFn: () =>
      qnapService.getDownloadJobsList(
        connectionSettings as QnapConnectionString,
        connectionInfo?.sid as string,
        {
          from: (page - 1) * PAGE_SIZE,
          limit: PAGE_SIZE,
          field: sortStatus.columnAccessor as keyof DownloadJobModel,
          direction: sortStatus.direction == "asc" ? "ASC" : "DESC",
        }
      ),
    enabled: !!connectionSettings && !!connectionInfo?.sid,
    refetchInterval: 5000,
  });

  const startDownloadJobMutation = useMutation({
    mutationFn: (hash: string) =>
      qnapService.startDownloadJob(
        connectionSettings as QnapConnectionString,
        connectionInfo?.sid as string,
        hash
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
    },
  });

  const stopDownloadJobMutation = useMutation({
    mutationFn: (hash: string) =>
      qnapService.stopDownloadJob(
        connectionSettings as QnapConnectionString,
        connectionInfo?.sid as string,
        hash
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
    },
  });

  const removeDownloadJobMutation = useMutation({
    mutationFn: (hash: string) =>
      qnapService.removeDownloadJob(
        connectionSettings as QnapConnectionString,
        connectionInfo?.sid as string,
        hash
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
    },
  });

  return (
    <Container fluid>
      {!!data && (
        <DataTable
          width="600"
          striped
          withTableBorder
          withColumnBorders
          highlightOnHover
          records={data.data}
          fetching={
            isFetching ||
            startDownloadJobMutation.isPending ||
            stopDownloadJobMutation.isPending ||
            removeDownloadJobMutation.isPending
          }
          columns={[
            {
              accessor: "actions",
              title: "Actions",
              render: ({ state, hash }) => (
                <Group gap={4}>
                  <ActionIcon
                    size="sm"
                    variant="subtle"
                    color="red"
                    onClick={() =>
                      modals.openConfirmModal({
                        title: "Delete your download with data",
                        centered: true,
                        children:
                          "Are you sure you want to delete this download? This action is destructive and you will not be able to restore your data.",
                        labels: {
                          confirm: "Delete download",
                          cancel: "No don't delete it",
                        },
                        confirmProps: { color: "red" },
                        onConfirm: () =>
                          removeDownloadJobMutation.mutateAsync(hash),
                      })
                    }
                  >
                    <IconTrashX size={16} />
                  </ActionIcon>
                  {state == DownloadJobState.Stopped && (
                    <ActionIcon
                      size="sm"
                      variant="subtle"
                      color="green"
                      onClick={() => startDownloadJobMutation.mutateAsync(hash)}
                    >
                      <IconPlayerPlay size={16} />
                    </ActionIcon>
                  )}
                  {state != DownloadJobState.Stopped &&
                    state != DownloadJobState.Completed && (
                      <ActionIcon
                        size="sm"
                        variant="subtle"
                        color="blue"
                        onClick={() =>
                          stopDownloadJobMutation.mutateAsync(hash)
                        }
                      >
                        <IconPlayerStop size={16} />
                      </ActionIcon>
                    )}
                </Group>
              ),
            },
            ...dataTableColumns,
          ]}
          idAccessor="hash"
          sortStatus={sortStatus}
          onSortStatusChange={setSortStatus}
          totalRecords={data.total}
          recordsPerPage={PAGE_SIZE}
          page={page}
          onPageChange={setPage}
        />
      )}
    </Container>
  );
}
