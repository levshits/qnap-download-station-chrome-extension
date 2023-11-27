import { ConnectionSettingsForm } from "./ConnectionSettingsForm";
import { qnapStore } from "../../common/QnapStore";
import { useQnapStore } from "../../common/useQnapStore";
import { Container } from "@mantine/core";

export function SettingsPage() {
  const { isInitialized, state: connectionSettings } = useQnapStore(
    (x) => x.NasConnectionSettings
  );

  return (
    <Container>
      {!!isInitialized && (
        <ConnectionSettingsForm
          model={connectionSettings}
          onSubmit={qnapStore.saveConnectionSettings}
        />
      )}
    </Container>
  );
}
