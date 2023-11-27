import {
  runtime
} from "webextension-polyfill";
import { qnapStore } from "../common/QnapStore";
import { handleNewSettings, subscribeToEvents } from "./Worker";

runtime.onInstalled.addListener(() => {
  qnapStore.initialize().then(() => {
    init();
  });
});


export async function init() {
  subscribeToEvents();
  await handleNewSettings();
}
