import { Bookmark } from "./parseSidekickBookmarks";

export const filterBookmarks = (bookmarks: Bookmark[], searchText: string) => {
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
