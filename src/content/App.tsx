import "@mantine/core/styles.css";
import {
  MantineProvider,
  Tabs,
  ActionIcon,
  useMantineColorScheme,
  useComputedColorScheme,
  Title,
  AppShell,
  Group,
} from "@mantine/core";
import { IconSun, IconMoon } from "@tabler/icons-react";
import { SettingsPage } from "./views/SettingsPage";
import { theme } from "../theme";
import "./App.css";
import { DownloadsPage } from "./views/DownloadsPage";
import {ReactComponent as LogoIcon} from "./logo.svg";
import { i18n } from "webextension-polyfill";

function ColorSchemePicker() {
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme("light", {
    getInitialValueInEffect: true,
  });

  return (
    <ActionIcon
      onClick={() =>
        setColorScheme(computedColorScheme === "light" ? "dark" : "light")
      }
      variant="default"
      size="xl"
      aria-label={i18n.getMessage("themeSwitchLabel")}>
      <IconSun
        stroke={1.5}
        display={computedColorScheme === "light" ? "none" : "block"}
      />
      <IconMoon
        stroke={1.5}
        display={computedColorScheme === "dark" ? "none" : "block"}
      />
    </ActionIcon>
  );
}

function App() {
  return (
    <MantineProvider theme={theme} defaultColorScheme="dark">
      <AppShell header={{ height: 80 }}>
        <AppShell.Header>
          <Group justify="space-between" p="md">
            <LogoIcon height={48} />
            <Title order={1}>{i18n.getMessage("appTitle")}</Title>
            <ColorSchemePicker />
          </Group>
        </AppShell.Header>
        <AppShell.Main>
          <Tabs defaultValue="downloads">
            <Tabs.List grow>
              <Tabs.Tab value="downloads">{i18n.getMessage("tabTitleDownloads")}</Tabs.Tab>
              <Tabs.Tab value="settings">{i18n.getMessage("tabTitleSettings")}</Tabs.Tab>
            </Tabs.List>
            <Tabs.Panel value="downloads">
              <DownloadsPage />
            </Tabs.Panel>
            <Tabs.Panel value="settings">
              <SettingsPage />
            </Tabs.Panel>
          </Tabs>
        </AppShell.Main>
      </AppShell>
    </MantineProvider>
  );
}

export default App;
