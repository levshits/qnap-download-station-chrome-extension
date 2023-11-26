import {
  runtime
} from "webextension-polyfill";
import { qnapStore } from "../common/QnapStore";
import { handleNewSettings, subscribeToEvents } from "./Worker";

runtime.onInstalled.addListener(() => {
  console.log("[background] loaded ");
  qnapStore.initialize().then(() => {
    init();
  });
});


export async function init() {
  subscribeToEvents();
  await handleNewSettings();
}
