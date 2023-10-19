import { List, LocalStorage, open } from "@raycast/api";
import { useEffect, useMemo, useState } from "react";

import { BookmarkListItem } from "./components/BookmarkListItem";
import { filterBookmarks } from "./lib/filterBookmarks";
import { Bookmark, parseSidekickBookmarks } from "./lib/parseSidekickBookmarks";

const getBookmarkHistoryFromLocalStorage = async (): Promise<Bookmark[]> => {
  const bookmarkHistoryData = await LocalStorage.getItem("history");
  return typeof bookmarkHistoryData === "string"
    ? JSON.parse(bookmarkHistoryData)
    : [];
};

const updateHistoryAndOpenBookmark = async (bookmark: Bookmark) => {
  const history = await getBookmarkHistoryFromLocalStorage();
  const uniqueHistory = history.filter((item) => item.url !== bookmark.url);
  const updatedHistory = [bookmark, ...uniqueHistory].slice(0, 7);
  await LocalStorage.setItem("history", JSON.stringify(updatedHistory));
  open(bookmark.url);
};

const Command = () => {
  const [searchText, setSearchText] = useState("");

  const allBookmarks = parseSidekickBookmarks();
  const filteredBookmarks = useMemo(
    () => filterBookmarks(allBookmarks, searchText),
    [allBookmarks, searchText]
  );

  const [history, setHistory] = useState<Bookmark[]>([]);
  useEffect(() => {
    (async () => {
      const history = await getBookmarkHistoryFromLocalStorage();
      setHistory(history);
    })();
  }, [setHistory]);

  // useEffect(() => {
  //   LocalStorage.clear();
  // });

  return (
    <List
      onSearchTextChange={setSearchText}
      searchBarPlaceholder="Search bookmarks..."
      throttle
    >
      <List.Item title={""} subtitle={`${filteredBookmarks.length} posts`} />
      {!searchText && (
        <List.Section title={"History"}>
          {history.map((bookmark) => (
            <BookmarkListItem
              key={bookmark.guid}
              bookmark={bookmark}
              onClick={updateHistoryAndOpenBookmark}
            />
          ))}
        </List.Section>
      )}
      <List.Section title={"Results"}>
        {filteredBookmarks.map((bookmark) => (
          <BookmarkListItem
            key={bookmark.guid}
            bookmark={bookmark}
            onClick={updateHistoryAndOpenBookmark}
          />
        ))}
      </List.Section>
    </List>
  );
};

export default Command;
