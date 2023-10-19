import { LocalStorage } from "@raycast/api";

import { BookmarkType } from "./parseBookmarks";

export const getBookmarkHistoryFromLocalStorage = async (): Promise<
  BookmarkType[]
> => {
  const bookmarkHistoryData = await LocalStorage.getItem("history");
  return typeof bookmarkHistoryData === "string"
    ? JSON.parse(bookmarkHistoryData)
    : [];
};
