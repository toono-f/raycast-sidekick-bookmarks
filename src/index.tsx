import { List } from "@raycast/api";
import { useMemo, useState } from "react";

import { filterValidAndSearchedBookmarks } from "./common/filterValidAndSearchedBookmarks";
import { parseBookmarks } from "./common/parseBookmarks";
import { BookmarkListItem } from "./components/BookmarkListItem";
import { useHistory } from "./hooks/useHistory";

const Command = () => {
  const [searchText, setSearchText] = useState("");

  const bookmarks = parseBookmarks();
  const filteredBookmarks = useMemo(
    () => filterValidAndSearchedBookmarks(bookmarks, searchText),
    [bookmarks, searchText]
  );

  const history = useHistory();
  // useEffect(() => LocalStorage.clear(), []);

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
            <BookmarkListItem key={bookmark.guid} bookmark={bookmark} />
          ))}
        </List.Section>
      )}
      <List.Section title={"Results"}>
        {filteredBookmarks.map((bookmark) => (
          <BookmarkListItem key={bookmark.guid} bookmark={bookmark} />
        ))}
      </List.Section>
    </List>
  );
};

export default Command;
