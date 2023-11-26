import { useQnapStore } from "../../common/useQnapStore";
import {
  Box,
  ColumnConfig,
  Data,
  DataFilter,
  DataFilters,
  DataSearch,
  DataSummary,
  DataTable,
  Page,
  PageContent,
  PageHeader,
  Pagination,
  Spinner,
  Toolbar,
  View,
} from "grommet";
import { DownloadJobModel } from "../../common/QnapService";
import { useState } from "react";

const columns: ColumnConfig<DownloadJobModel>[] = [
  {
    property: "priority",
    header: "Id",
    primary: true,
  },
  {
    property: "source_name",
    header: "Filename",
    sortable: true,
  },
  {
    property: "create_time",
    header: "Create Time",
    sortable: true,
  }
];

const defaultView: View = {
  search: '',
  sort: { property: 'name', direction: 'asc' },
  step: 10,
};

export function DownloadsPage() {
  const { isInitialized, state } = useQnapStore((x) => x.Jobs);

  const [view, setView] = useState(defaultView);

  return (
    <Page>
      <PageContent>
        <PageHeader title="Download Jobs" size="small" justify="start" />
        {!!state && (
          <Data data={state}           
            defaultView={defaultView}
            view={view}
            onView={setView}
            total={state.length}>
            <Box flex overflow="auto">
              <DataTable columns={columns} />
              <Pagination />
            </Box>
          </Data>
        )}
      </PageContent>
    </Page>
  );
}
