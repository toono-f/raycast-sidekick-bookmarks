import { BookmarkType } from "./parseBookmarks";

export const filterBookmarks = (
  bookmarks: BookmarkType[],
  searchText: string
) => {
  const trimmedBookmarks = bookmarks.filter(
    (bookmark) => bookmark.name && bookmark.name.length > 1
  );
  if (!searchText) return trimmedBookmarks;
  const searchLower = searchText.toLowerCase();
  return trimmedBookmarks.filter(
    (bookmark) =>
      bookmark.name.toLowerCase().includes(searchLower) ||
      bookmark.url.toLowerCase().includes(searchLower)
  );
};
