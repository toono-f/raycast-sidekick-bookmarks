import { Action, ActionPanel, List, LocalStorage } from "@raycast/api";
import { getFavicon } from "@raycast/utils";

import { getBookmarkHistoryFromLocalStorage } from "../lib/getBookmarkHistoryFromLocalStorage";
import { BookmarkType } from "../lib/parseBookmarks";

type Props = {
  bookmark: BookmarkType;
};

export const BookmarkListItem = ({ bookmark }: Props) => {
  return (
    <List.Item
      icon={getFavicon(bookmark.url)}
      title={bookmark.name}
      subtitle={bookmark.url}
      // TODO: フォルダ情報を記載する
      // accessories={[{ icon: folder.icon, title: folder.name }]}
      actions={
        <ActionPanel>
          <ActionPanel.Section>
            <Action
              title="Open in Browser"
              onAction={() => updateHistoryAndOpenBookmark(bookmark)}
            />
          </ActionPanel.Section>
        </ActionPanel>
      }
    />
  );
};

const updateHistoryAndOpenBookmark = async (bookmark: BookmarkType) => {
  const history = await getBookmarkHistoryFromLocalStorage();
  const uniqueHistory = history.filter((item) => item.url !== bookmark.url);
  const updatedHistory = [bookmark, ...uniqueHistory].slice(0, 7);
  await LocalStorage.setItem("history", JSON.stringify(updatedHistory));
  open(bookmark.url);
};
