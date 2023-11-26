import { ConnectionSettingsForm } from "./ConnectionSettingsForm";
import { qnapStore } from "../../common/QnapStore";
import { useQnapStore } from "../../common/useQnapStore";
import { Page, PageContent, PageHeader, Spinner } from "grommet";

export function SettingsPage() {
    const {isInitialized, state: connectionSettings} = useQnapStore(x=>x.NasConnectionSettings)

  return <Page>
        <PageContent>
          <PageHeader title="Connection Settings" size="small"/>
        </PageContent>
        {!!isInitialized && <ConnectionSettingsForm model={connectionSettings} onSubmit={qnapStore.saveConnectionSettings} />}
      </Page>
}