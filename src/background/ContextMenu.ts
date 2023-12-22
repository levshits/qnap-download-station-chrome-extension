import { Menus, contextMenus, i18n, runtime } from "webextension-polyfill";
import { QnapFolder } from "../common/Models";
import { qnapService } from "../common/QnapService";
import { qnapStore } from "../common/QnapStore";

export async function handleAddUrl(info: Menus.OnClickData, folder: QnapFolder) {
    if (!!info.linkUrl || !!info.selectionText) {
        let state = await qnapStore.getState();
        if (!!state.ConnectionInfo?.sid) {
            return qnapService.addDownloadJob(
                state.NasConnectionSettings,
                state.ConnectionInfo.sid,
                {
                    tempFolder: folder.tempFolder,
                    targetFolder: folder.moveFolder,
                    url: (info.linkUrl || info.selectionText) as string,
                }
            );
        }
    }
}

function onMenuItemCreated() {
    if (runtime.lastError) {
      console.error(`Error: ${runtime.lastError}`);
    }
  }

const contextMenuIdPrefix = "qnap-download-station-manager--add-url--";

export async function createContextMenus() {
  await contextMenus.removeAll();

  await qnapStore.getState().then((state) => {
    if (!!state?.NasConnectionSettings?.folders?.length && !!state.ConnectionInfo.sid) {
      if (state.NasConnectionSettings?.folders?.length == 1) {
        contextMenus.create(
          {
            id: `${contextMenuIdPrefix}${state.NasConnectionSettings.folders[0].name}`,
            title: i18n.getMessage("contextMenuNodeTitle"),
            contexts: ["link", "selection"],
          },
          onMenuItemCreated
        );
      } else {
        const parentId = contextMenus.create({
          id: `${contextMenuIdPrefix}parent`,
          title: i18n.getMessage("contextMenuNodeTitle"),
          contexts: ["link", "selection"],
        });

        state.NasConnectionSettings.folders.forEach((folder) => {
          contextMenus.create(
            {
              id: `${contextMenuIdPrefix}${folder.name}`,
              title: folder.name,
              contexts: ["link", "selection"],
              parentId: parentId,
            },
            onMenuItemCreated
          );
        });
      }

      contextMenus.onClicked.addListener((info, tab) => {
        if (info.menuItemId.toString().startsWith(contextMenuIdPrefix)) {
            const folderName = info.menuItemId
                .toString()
                .replace(contextMenuIdPrefix, "");
            const folderSettings = state.NasConnectionSettings?.folders?.find(
                (x) => x.name == folderName
            );

            if (!!folderSettings) {
            return handleAddUrl(info, folderSettings);
          }
        }
      });
    }
  });
}
