import { Action, ActionPanel, List, LocalStorage, open } from "@raycast/api";
import { getFavicon } from "@raycast/utils";

import { getBookmarkHistory } from "../common/getBookmarkHistory";
import { BookmarkType } from "../common/parseBookmarks";

type Props = {
  bookmark: BookmarkType;
};

export const BookmarkListItem = ({ bookmark }: Props) => {
  return (
    <List.Item
      icon={getFavicon(bookmark.url)}
      title={bookmark.name}
      subtitle={bookmark.url}
      // TODO: フォルダ情報を記載したい
      // accessories={[{ icon: folder.icon, tag: folder.name }]}
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
  const history = await getBookmarkHistory();
  const uniqueHistory = history.filter((item) => item.url !== bookmark.url);
  const updatedHistory = [bookmark, ...uniqueHistory].slice(0, 7);
  await LocalStorage.setItem("history", JSON.stringify(updatedHistory));
  open(bookmark.url);
};
