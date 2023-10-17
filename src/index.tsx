import { List } from "@raycast/api";
import { useMemo, useState } from "react";
import { allBookmarks, filterBookmarks } from "./function";
import { BookmarkListItem } from "./BookmarkListItem";

const SidekickBookmarksCommand = () => {
  const [searchText, setSearchText] = useState("");
  const filteredBookmarks = useMemo(() => filterBookmarks(allBookmarks, searchText), [searchText]);

  return (
    <List onSearchTextChange={setSearchText} searchBarPlaceholder="Search Sidekick bookmarks..." throttle>
      <List.Section title={"Results"} subtitle={String(filteredBookmarks.length)}>
        {filteredBookmarks.map((bookmark) => (
          <BookmarkListItem key={bookmark.guid} bookmark={bookmark} />
        ))}
      </List.Section>
    </List>
  );
};

export default SidekickBookmarksCommand;
