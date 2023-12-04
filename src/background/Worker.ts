import { storage, action, i18n } from "webextension-polyfill";
import { DownloadJobState, LoginResponseModel, qnapService } from "../common/QnapService";
import { qnapStore } from "../common/QnapStore";
import { createContextMenus } from "./ContextMenu";

export function subscribeToEvents() {
  storage.local.onChanged.addListener((changes) => {
    if (!!changes.NasConnectionSettings) {
      handleNewSettings();
    }
    if (!!changes.Jobs) {
        handleJobsUpdate();
      }
  });
}

function login() {
  return qnapStore.getState().then((result) => {
    return qnapService
      .login(result.NasConnectionSettings)
      .then((response: LoginResponseModel) => {
        return qnapStore.saveSid(response.sid);
      });
  });
}

var monitorServiceId: NodeJS.Timer | undefined;

function monitorDownloadJobs() {
    if(!monitorServiceId){
    monitorServiceId = setInterval(() => { 
        return qnapStore.getState().then((result) => {
        if(!!result.ConnectionInfo.sid){
            var sid = result.ConnectionInfo.sid;
                return qnapService.getDownloadJobsList(result.NasConnectionSettings, sid)
                .then(async (response) => {
                    await qnapStore.updateJobs(response);
                })
        } else {
            monitorServiceId = undefined;
            clearInterval(monitorServiceId);
        }
    })}, 10000);
}
}

export function handleNewSettings() {
  return login()
    .then(async () => {
        await createContextMenus();
        monitorDownloadJobs();
    })
    .catch((error) => {
      console.error(error);
        setBadge(i18n.getMessage("badgeStatusError"), '#F00');
    })
}
function handleJobsUpdate() {
    qnapStore.getState().then((result) => {
        var inProgressJobs = result.Jobs.filter((job) => job.state == DownloadJobState.Downloading).length;

        setBadge(`${inProgressJobs}/${result.Jobs.length}`, '#B9FF66');
    });
}

function setBadge(text: string, color: string) {
    action.setBadgeBackgroundColor({ color: color });
    action.setBadgeText({
        text: text
    });
}

