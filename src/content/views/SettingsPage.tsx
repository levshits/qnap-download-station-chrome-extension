import { ConnectionSettingsForm } from "./ConnectionSettingsForm";
import {qnapStore, QnapStoreState} from "../../common/QnapStore";
import { useQnapStore } from "../../common/useQnapStore";
import { Container } from "@mantine/core";
import { permissions } from "webextension-polyfill";
import { QnapConnectionString } from "../../common/Models";

const connectionSettingsSelector = (x: QnapStoreState) => x.NasConnectionSettings;

export function SettingsPage() {
  const { isInitialized, state: connectionSettings } = useQnapStore(connectionSettingsSelector);

  const saveSettings = (settings: QnapConnectionString) => {
    return permissions
      .request({
        origins: [
          settings.url[settings.url.length - 1] == "/"
            ? settings.url
            : `${settings.url}/`,
        ],
      })
      .then((result) => {
        if (!result) {
          console.log("Permission was not granted");
        } else {
          return qnapStore.saveConnectionSettings({
            ...settings,
          });
        }
      });
  };

  return (
    <Container>
      {!!isInitialized && (
        <ConnectionSettingsForm
          model={connectionSettings}
          onSubmit={saveSettings}
        />
      )}
    </Container>
  );
}
