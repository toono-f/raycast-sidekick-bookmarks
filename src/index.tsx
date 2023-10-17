import { ActionPanel, Action, List } from "@raycast/api";
import { getFavicon } from "@raycast/utils";
import { useMemo, useState } from "react";
import { join } from "path";
import { homedir } from "os";
import * as fs from "fs";

const BOOKMARKS_PATH = join(homedir(), "/Library/Application Support/Sidekick/Default/Bookmarks");

type Bookmark = {
  name: string;
  url: string;
  guid: string;
};

class SidekickBookmarkVisitor {
  bookmarks: Bookmark[] = [];

  visit(node: Node) {
    this.bookmarks.push({
      name: node.name,
      url: node.url,
      guid: node.guid,
    });
  }
}

type Node = {
  name: string;
  guid: string;
  type: string;
  url: string;
  children?: Node[];
};

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

const BookmarkListItem = ({ bookmark }: { bookmark: Bookmark }) => (
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

const filterBookmarks = (bookmarks: Bookmark[], searchText: string) => {
  if (!searchText) return bookmarks;
  const searchLower = searchText.toLowerCase();
  return bookmarks.filter(
    (bookmark) => bookmark.name.toLowerCase().includes(searchLower) || bookmark.url.toLowerCase().includes(searchLower)
  );
};

const parseSidekickBookmarks = (): Bookmark[] => {
  const data = fs.readFileSync(BOOKMARKS_PATH, "utf-8");
  const json = JSON.parse(data);
  const parser = new SidekickBookmarkVisitor();
  ["bookmark_bar", "other"].forEach((path) => walkEdge(json.roots[path], parser));
  return parser.bookmarks;
};

const walkEdge = (node: Node, visitor: SidekickBookmarkVisitor) => {
  switch (node.type) {
    case "url":
      visitor.visit(node);
      break;
    case "folder":
      node.children?.forEach((child) => walkEdge(child, visitor));
      break;
  }
};

const allBookmarks = parseSidekickBookmarks();
