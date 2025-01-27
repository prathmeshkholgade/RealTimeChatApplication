import { WebContainer } from "@webcontainer/api";

// Call only once
let webcontainerinstance = null;
export const getWebContainer = async () => {
  if (webcontainerinstance === null) {
    webcontainerinstance = await WebContainer.boot();
  }
  return webcontainerinstance;
};
