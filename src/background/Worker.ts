import {storage, action, i18n, permissions} from "webextension-polyfill";
import {DownloadJobModel, DownloadJobState, qnapService} from "../common/QnapService";
import { qnapStore } from "../common/QnapStore";
import { createContextMenus } from "./ContextMenu";

export function subscribeToEvents() {
    storage.sync.onChanged.addListener(async (changes) => {
        if (!!changes.NasConnectionSettings) {
            await handleNewSettings();
        }
    });

    if (!permissions.onAdded.hasListener(handleNewSettings)) {
        permissions.onAdded.addListener(handleNewSettings);
    }
}

async function login() {
    let result = await qnapStore.getState();
    if(!!result.NasConnectionSettings.url) {
        const  origin = result.NasConnectionSettings.url[result.NasConnectionSettings.url.length - 1] == "/"
            ? result.NasConnectionSettings.url
            : `${result.NasConnectionSettings.url}/`
        if(await permissions.contains({
            origins: [origin]
        })){
            let response = await qnapService.login(result.NasConnectionSettings);
            await qnapStore.saveSid(response.sid);
        }
    }
}

let monitorServiceId: NodeJS.Timer | undefined;

function monitorDownloadJobs() {
    if(!monitorServiceId){
    monitorServiceId = setInterval(async () => {
        let result = await qnapStore.getState();
        if (!!result.ConnectionInfo.sid) {
            const sid = result.ConnectionInfo.sid;
            let response = await qnapService.getDownloadJobsList(result.NasConnectionSettings, sid);
            await handleJobsUpdate(response.data);
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

async function handleJobsUpdate(jobs: DownloadJobModel[]) {
    const inProgressJobs = jobs.filter((job) => job.state == DownloadJobState.Downloading).length;
    await setBadge(`${inProgressJobs}/${jobs.length}`, '#B9FF66');
}

async function setBadge(text: string, color: string) {
    await action.setBadgeBackgroundColor({ color: color });
    await action.setBadgeText({
        text: text
    });
}

