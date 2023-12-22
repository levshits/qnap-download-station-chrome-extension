import { storage, action, i18n } from "webextension-polyfill";
import { DownloadJobState, qnapService } from "../common/QnapService";
import { qnapStore } from "../common/QnapStore";
import { createContextMenus } from "./ContextMenu";

export function subscribeToEvents() {
  storage.local.onChanged.addListener(async (changes) => {
    if (!!changes.NasConnectionSettings) {
        await handleNewSettings();
    }
    if (!!changes.Jobs) {
        await handleJobsUpdate();
    }
  });
}

async function login() {
    let result = await qnapStore.getState();
    let response = await qnapService.login(result.NasConnectionSettings);
    await qnapStore.saveSid(response.sid);
}

let monitorServiceId: NodeJS.Timer | undefined;

function monitorDownloadJobs() {
    if(!monitorServiceId){
    monitorServiceId = setInterval(async () => {
        let result = await qnapStore.getState();
        if (!!result.ConnectionInfo.sid) {
            const sid = result.ConnectionInfo.sid;
            let response = await qnapService.getDownloadJobsList(result.NasConnectionSettings, sid);
            await qnapStore.updateJobs(response);
        } else {
            monitorServiceId = undefined;
            clearInterval(monitorServiceId);
        }
    }, 10000);
}
}

export async function handleNewSettings() {
    try {
        await login();
        await createContextMenus();
        monitorDownloadJobs();
    } catch (error) {
        console.error(error);
        await setBadge(i18n.getMessage("badgeStatusError"), '#F00');
    }
}

async function handleJobsUpdate() {
    let result = await qnapStore.getState();
    const inProgressJobs = result.Jobs.filter((job) => job.state == DownloadJobState.Downloading).length;
    await setBadge(`${inProgressJobs}/${result.Jobs.length}`, '#B9FF66');
}

async function setBadge(text: string, color: string) {
    await action.setBadgeBackgroundColor({ color: color });
    await action.setBadgeText({
        text: text
    });
}

