import "@mantine/core/styles.css";
import "mantine-datatable/styles.layer.css";
import "./App.css";
import {AppShell, Group, MantineProvider, Title,} from "@mantine/core";
import {theme} from "../theme";
import {ReactComponent as LogoIcon} from "./logo.svg";
import {i18n} from "webextension-polyfill";
import {ModalsProvider} from "@mantine/modals";
import {ColorSchemePicker} from "./components/ColorSchemePicker";
import {ComponentMainSection} from "./components/ComponentMainSection";


const App = () => (
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

export default App;
