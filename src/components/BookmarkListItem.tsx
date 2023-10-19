import { Action, ActionPanel, List } from "@raycast/api";
import { getFavicon } from "@raycast/utils";

import { Bookmark } from "../lib/parseSidekickBookmarks";

type Props = {
  bookmark: Bookmark;
  onClick: (bookmark: Bookmark) => void;
};

export const BookmarkListItem = ({ bookmark, onClick }: Props) => {
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
              onAction={() => onClick(bookmark)}
            />
          </ActionPanel.Section>
        </ActionPanel>
      }
    />
  );
};
