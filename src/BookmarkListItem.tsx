import { ActionPanel, Action, List } from "@raycast/api";
import { getFavicon } from "@raycast/utils";
import { Bookmark } from "./type";

export const BookmarkListItem = ({ bookmark }: { bookmark: Bookmark }) => (
  <List.Item
    icon={getFavicon(bookmark.url)}
    title={bookmark.name}
    actions={
      <ActionPanel>
        <ActionPanel.Section>
          <Action.OpenInBrowser title="Open in Browser" url={bookmark.url} />
        </ActionPanel.Section>
      </ActionPanel>
    }
  />
);
