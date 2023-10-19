import { List } from "@raycast/api";
import { useMemo, useState } from "react";

import { filterBookmarks } from "./common/filterBookmarks";
import { parseBookmarks } from "./common/parseBookmarks";
import { BookmarkListItem } from "./components/BookmarkListItem";
import { useHistory } from "./hooks/useHistory";

const Command = () => {
  const [searchText, setSearchText] = useState("");

  const allBookmarks = parseBookmarks();
  const filteredBookmarks = useMemo(
    () => filterBookmarks(allBookmarks, searchText),
    [allBookmarks, searchText]
  );

  const history = useHistory();
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
