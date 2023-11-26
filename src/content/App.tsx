import {
  Box,
  Button,
  Grommet,
  Header,
  HeaderExtendedProps,
  Menu,
  Nav,
  Tab,
  Tabs,
  Text,
} from "grommet";
import { SettingsPage } from "./views/SettingsPage";
import { theme } from "../theme";
import "./App.css";
import { useState } from "react";
import { Moon, Sun } from "grommet-icons";
import { DownloadsPage } from "./views/DownloadsPage";

const AppBar = (props: HeaderExtendedProps) => {
  return (
    <Header
      pad="medium"
      background="brand"
      margin={{ bottom: "medium" }}
      sticky="scrollup"
      {...props}
    />
  );
};

function App() {
  const [dark, setDark] = useState(true);

  return (
    <Grommet full="min" theme={theme} themeMode={dark ? "dark" : "light"}>
        <AppBar>
          <Text size="large">QNAP Download Station</Text>
          <Button
            a11yTitle={dark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            icon={dark ? <Moon /> : <Sun />}
            onClick={() => setDark(!dark)}
          />
        </AppBar>
        <Tabs justify="start">
          <Tab title="Downloads">
            <Box>
              <DownloadsPage />
            </Box>
          </Tab>
          <Tab title="Settings">
          <Box>
              <SettingsPage />
            </Box>
          </Tab>
        </Tabs>
    </Grommet>
  );
}

export default App;
