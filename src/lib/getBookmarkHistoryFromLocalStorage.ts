import { LocalStorage } from "@raycast/api";

import { Bookmark } from "./parseSidekickBookmarks";

export const getBookmarkHistoryFromLocalStorage = async (): Promise<
  Bookmark[]
> => {
  const bookmarkHistoryData = await LocalStorage.getItem("history");
  return typeof bookmarkHistoryData === "string"
    ? JSON.parse(bookmarkHistoryData)
    : [];
};
