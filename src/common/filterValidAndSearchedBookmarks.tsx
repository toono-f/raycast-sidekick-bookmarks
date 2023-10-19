import { BookmarkType } from "./parseBookmarks";

export const filterValidAndSearchedBookmarks = (
  bookmarks: BookmarkType[],
  searchText: string
) => {
  const validBookmarks = bookmarks.filter(
    (bookmark) => bookmark.name && bookmark.name.length > 1
  );

  if (searchText) {
    const normalizedSearchKeyword = searchText.toLowerCase();
    return validBookmarks.filter(
      (bookmark) =>
        bookmark.name.toLowerCase().includes(normalizedSearchKeyword) ||
        bookmark.url.toLowerCase().includes(normalizedSearchKeyword)
    );
  }

  return validBookmarks;
};
