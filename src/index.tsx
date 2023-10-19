import { List, LocalStorage, open } from "@raycast/api";
import { useEffect, useMemo, useState } from "react";
import { allBookmarks, filterBookmarks } from "./lib/common";
import { BookmarkListItem } from "./components/BookmarkListItem";
import { Bookmark } from "./types";

const SidekickBookmarksCommand = () => {
  const [searchText, setSearchText] = useState("");
  const filteredBookmarks = useMemo(() => filterBookmarks(allBookmarks, searchText), [searchText]);
  const [historyList, setHistoryList] = useState<Bookmark[]>([]);

  useEffect(() => {
    const getHistory = async () => {
      const history = await LocalStorage.getItem("history");
      if (typeof history === "string") {
        const array = history.split(" && ").map((item) => JSON.parse(item));
        // TODO: 重複を削除したい（localStorageにセットする時に行いたい）
        const uniqueArray = array.filter((item, index, self) => self.findIndex((v) => v.guid === item.guid) === index);
        // TODO: 最大10件までにしたい（localStorageにセットする時に行いたい）
        const slicedArray = uniqueArray.slice(0, 10);

        const reversedArray = slicedArray.reverse();
        setHistoryList(reversedArray as unknown as Bookmark[]);
      }
    };
    getHistory();
  }, []);

  const saveHistory = async (bookmark: Bookmark) => {
    const history = await LocalStorage.getItem("history");
    if (history) {
      await LocalStorage.setItem("history", `${history} && ${JSON.stringify(bookmark)}`);
    } else {
      await LocalStorage.setItem("history", JSON.stringify(bookmark));
    }
    open(bookmark.url);
  };

  return (
    <List onSearchTextChange={setSearchText} searchBarPlaceholder="Search Sidekick bookmarks..." throttle>
      {!searchText && (
        <List.Section title={"History"} subtitle={String(historyList.length)}>
          {historyList.map((bookmark) => (
            <BookmarkListItem key={bookmark.guid} bookmark={bookmark} onClick={saveHistory} />
          ))}
        </List.Section>
      )}
      <List.Section title={"Results"} subtitle={String(filteredBookmarks.length)}>
        {filteredBookmarks.map((bookmark) => (
          <BookmarkListItem key={bookmark.guid} bookmark={bookmark} onClick={saveHistory} />
        ))}
      </List.Section>
    </List>
  );
};

export default SidekickBookmarksCommand;
