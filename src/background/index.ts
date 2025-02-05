import {
  runtime
} from "webextension-polyfill";
import pRetry from 'p-retry';
import { qnapStore } from "../common/QnapStore";
import { handleNewSettings, subscribeToEvents } from "./Worker";

runtime.onInstalled.addListener(() => {
  qnapStore.initialize().then(() => {
    return init();
  });
});

runtime.onStartup.addListener(() => {
  return init();
})

export async function init() {
  subscribeToEvents();

  await pRetry(handleNewSettings, {
    onFailedAttempt: error => {
      console.log(`Attempt ${error.attemptNumber} failed. There are ${error.retriesLeft} retries left. Error: ${error.message}`);
    },
    retries: 10
  })
}
