import { List, LocalStorage, open } from "@raycast/api";
import { useEffect, useMemo, useState } from "react";
import { allBookmarks, filterBookmarks } from "./lib/common";
import { BookmarkListItem } from "./components/BookmarkListItem";
import { Bookmark } from "./types";

const SidekickBookmarksCommand = () => {
  const [searchText, setSearchText] = useState("");
  const filteredBookmarks = useMemo(
    () => filterBookmarks(allBookmarks, searchText),
    [searchText]
  );
  const [historyList, setHistoryList] = useState<Bookmark[]>([]);

  useEffect(() => {
    const getHistory = async () => {
      const history = await LocalStorage.getItem("history");
      if (typeof history === "string") {
        const array = history.split(" && ").map((item) => JSON.parse(item));
        const uniqueArray = array.filter(
          (item, index, self) =>
            self.findIndex((v) => v.guid === item.guid) === index
        );

        setHistoryList(uniqueArray as unknown as Bookmark[]);
      }
    };
    getHistory();

    // エラーがあった場合は上記コメントアウトしてLocalStorage.clear();
  }, []);

  const saveHistory = async (bookmark: Bookmark) => {
    const history = await LocalStorage.getItem("history");
    if (history) {
      // TODO: 8件以上保存しないようにする（リファクタ検討）
      const historyArray = String(history)
        .split(" && ")
        .map((item) => JSON.parse(item));
      const slicedArray = historyArray.slice(0, 7);
      const stringifiedArray = slicedArray.map((item) => JSON.stringify(item));
      const resultString = stringifiedArray.join(" && ");

      await LocalStorage.setItem(
        "history",
        `${JSON.stringify(bookmark)} && ${resultString}`
      );
    } else {
      await LocalStorage.setItem("history", JSON.stringify(bookmark));
    }
    open(bookmark.url);
  };

  return (
    <List
      onSearchTextChange={setSearchText}
      searchBarPlaceholder="Search Sidekick bookmarks..."
      throttle
    >
      {!searchText && (
        <List.Section title={"History"} subtitle={String(historyList.length)}>
          {historyList.map((bookmark) => (
            <BookmarkListItem
              key={bookmark.guid}
              bookmark={bookmark}
              onClick={saveHistory}
            />
          ))}
        </List.Section>
      )}
      <List.Section
        title={"Results"}
        subtitle={String(filteredBookmarks.length)}
      >
        {filteredBookmarks.map((bookmark) => (
          <BookmarkListItem
            key={bookmark.guid}
            bookmark={bookmark}
            onClick={saveHistory}
          />
        ))}
      </List.Section>
    </List>
  );
};

export default SidekickBookmarksCommand;
