import { ActionPanel, Action, List } from "@raycast/api";
import { getFavicon } from "@raycast/utils";
import { Bookmark } from "../types";

type Props = {
  bookmark: Bookmark;
  onClick: (bookmark: Bookmark) => void;
};

export const BookmarkListItem = ({ bookmark, onClick }: Props) => {
  return (
    <List.Item
      icon={getFavicon(bookmark.url)}
      title={bookmark.name}
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
