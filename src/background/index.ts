import { runtime, contextMenus, i18n } from 'webextension-polyfill'

runtime.onInstalled.addListener(() => {
  console.log('[background] loaded ')
})

contextMenus.create({
    id: "copy-link-to-clipboard",
    title: i18n.getMessage("contextMenuNodeTitle"),
    contexts: ["link","selection"]
}, onCreated);

contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "copy-link-to-clipboard") {
        console.log(info);
    }
});



function onCreated() {
  if (runtime.lastError) {
    console.log(`Error: ${runtime.lastError}`);
  } else {
    console.log("Item created successfully");
  }
}

export {}