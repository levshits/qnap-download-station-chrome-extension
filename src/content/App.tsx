import "@mantine/core/styles.css";
import "mantine-datatable/styles.layer.css";
import {AppShell, Group, MantineProvider, Tabs, Title,} from "@mantine/core";
import {SettingsPage} from "./views/SettingsPage";
import {theme} from "../theme";
import "./App.css";
import {DownloadsPage} from "./views/DownloadsPage";
import {ReactComponent as LogoIcon} from "./logo.svg";
import {i18n} from "webextension-polyfill";
import {ModalsProvider} from "@mantine/modals";
import {ColorSchemePicker} from "./components/ColorSchemePicker";
import {QnapStoreState} from "../common/QnapStore";
import {useQnapStore} from "../common/useQnapStore";


const sidSelector = (x: QnapStoreState) => x.ConnectionInfo?.sid;

function ComponentMainSection() {
  const { state: sid } = useQnapStore(sidSelector);

  return <Tabs defaultValue={!!sid ? "downloads" : "settings"}>
    <Tabs.List grow>
      <Tabs.Tab value="settings">
        {i18n.getMessage("tabTitleSettings")}
      </Tabs.Tab>
      {!!sid && <Tabs.Tab value="downloads">
        {i18n.getMessage("tabTitleDownloads")}
      </Tabs.Tab>}
    </Tabs.List>
    <Tabs.Panel value="settings">
      <SettingsPage/>
    </Tabs.Panel>
    {!!sid && <Tabs.Panel value="downloads">
      <DownloadsPage/>
    </Tabs.Panel>}
  </Tabs>;
}

function App() {
  return (
    <MantineProvider theme={theme} defaultColorScheme="dark">
      <ModalsProvider>
        <AppShell header={{height: 80}}>
          <AppShell.Header>
            <Group justify="space-between" p="md">
              <LogoIcon height={48}/>
              <Title order={1}>{i18n.getMessage("appTitle")}</Title>
              <ColorSchemePicker/>
            </Group>
          </AppShell.Header>
          <AppShell.Main>
            <ComponentMainSection/>
          </AppShell.Main>
        </AppShell>
      </ModalsProvider>
    </MantineProvider>
  );
}

export default App;
