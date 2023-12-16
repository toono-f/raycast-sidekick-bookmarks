import { LocalStorage } from "@raycast/api";

import { BookmarkType } from "./parseBookmarks";

// TODO: プロファイルごとのBookmarkHistoryを取得する
export const getBookmarkHistory = async (): Promise<BookmarkType[]> => {
  const bookmarkHistoryData = await LocalStorage.getItem("history");
  return typeof bookmarkHistoryData === "string"
    ? JSON.parse(bookmarkHistoryData)
    : [];
};
