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

runtime.onStartup.addListener(() => {
  init();
})

export async function init() {
  subscribeToEvents();

  try{
    await handleNewSettings();
  } catch (error) {
    console.error(error);
  }
}
