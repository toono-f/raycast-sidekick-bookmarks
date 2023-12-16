import { LocalStorage } from "@raycast/api";

import { AccountType, BookmarkType } from "./parseBookmarks";

export const getBookmarkHistory = async (
  account: AccountType
): Promise<BookmarkType[]> => {
  const bookmarkHistoryData = await LocalStorage.getItem(`history_${account}`);
  return typeof bookmarkHistoryData === "string"
    ? JSON.parse(bookmarkHistoryData)
    : [];
};
