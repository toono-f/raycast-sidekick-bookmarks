import { LocalStorage } from "@raycast/api";

import { BookmarkType } from "./parseBookmarks";

export const getBookmarkHistory = async (): Promise<BookmarkType[]> => {
  const bookmarkHistoryData = await LocalStorage.getItem("history");
  return typeof bookmarkHistoryData === "string"
    ? JSON.parse(bookmarkHistoryData)
    : [];
};
