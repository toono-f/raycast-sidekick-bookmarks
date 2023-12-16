import { List } from "@raycast/api";
import { useMemo, useState } from "react";

import { filterValidAndSearchedBookmarks } from "./common/filterValidAndSearchedBookmarks";
import { AccountType, parseBookmarks } from "./common/parseBookmarks";
import { BookmarkListItem } from "./components/BookmarkListItem";
import { useHistory } from "./hooks/useHistory";

const Command = () => {
  const [searchText, setSearchText] = useState("");
  const [account, setAccount] = useState<AccountType>("profile");

  const bookmarks = parseBookmarks(account);
  const filteredBookmarks = useMemo(
    () => filterValidAndSearchedBookmarks(bookmarks, searchText),
    [bookmarks, searchText]
  );

  const history = useHistory();
  // 履歴に関するエラーが発生したら下記でローカルストレージをクリア
  // useEffect(() => LocalStorage.clear(), []);

  return (
    <List
      onSearchTextChange={setSearchText}
      searchBarPlaceholder="Search bookmarks..."
      searchBarAccessory={
        <List.Dropdown
          tooltip={"Select Account"}
          storeValue={true}
          onChange={(newValue) => setAccount(newValue as AccountType)}
        >
          <List.Dropdown.Section>
            <List.Dropdown.Item key={1} title={"default"} value={"default"} />
          </List.Dropdown.Section>
          <List.Dropdown.Section>
            <List.Dropdown.Item key={1} title={"profile"} value={"profile"} />
          </List.Dropdown.Section>
        </List.Dropdown>
      }
      throttle
    >
      <List.Item title={""} subtitle={`${filteredBookmarks.length} posts`} />
      {!searchText && (
        <List.Section title={"Bookmark History"}>
          {history.map((bookmark) => (
            <BookmarkListItem key={bookmark.guid} bookmark={bookmark} />
          ))}
        </List.Section>
      )}
      <List.Section title={"Bookmark Results"}>
        {filteredBookmarks.map((bookmark) => (
          <BookmarkListItem key={bookmark.guid} bookmark={bookmark} />
        ))}
      </List.Section>
    </List>
  );
};

export default Command;
