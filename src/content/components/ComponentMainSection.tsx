import {useQnapStore} from "../../common/useQnapStore";
import {Tabs} from "@mantine/core";
import {i18n} from "webextension-polyfill";
import {SettingsPage} from "../views/SettingsPage";
import {DownloadsPage} from "../views/DownloadsPage";
import {QnapStoreState} from "../../common/QnapStore";

const sidSelector = (x: QnapStoreState) => x.ConnectionInfo?.sid;

export function ComponentMainSection() {
    const {state: sid} = useQnapStore(sidSelector);

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