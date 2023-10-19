import { join } from "path";
import { homedir } from "os";
import * as fs from "fs";
import { Bookmark, Node } from "../types";

export const filterBookmarks = (bookmarks: Bookmark[], searchText: string) => {
  const trimmedBookmarks = bookmarks.filter(
    (bookmark) => bookmark.name && bookmark.name.length > 1
  );
  if (!searchText) return trimmedBookmarks;
  const searchLower = searchText.toLowerCase();
  return trimmedBookmarks.filter(
    (bookmark) =>
      bookmark.name.toLowerCase().includes(searchLower) ||
      bookmark.url.toLowerCase().includes(searchLower)
  );
};

const sidekickBookmarkVisitor = () => {
  const bookmarks: Bookmark[] = [];

  const visit = (node: Node) => {
    bookmarks.push({
      name: node.name,
      url: node.url,
      guid: node.guid,
    });
  };

  return { bookmarks, visit };
};

const walkEdge = (node: Node, visitor: (node: Node) => void) => {
  switch (node.type) {
    case "url":
      visitor(node);
      break;
    case "folder":
      node.children?.forEach((child) => walkEdge(child, visitor));
      break;
  }
};
// TODO: アカウントを切り替えられるようにする
const BOOKMARKS_PATH = join(
  homedir(),
  "/Library/Application Support/Sidekick/Default/Bookmarks"
  // "/Library/Application Support/Sidekick/Profile 1/Bookmarks"
);

export const parseSidekickBookmarks = (): Bookmark[] => {
  const data = fs.readFileSync(BOOKMARKS_PATH, "utf-8");
  const json = JSON.parse(data);
  const { bookmarks, visit } = sidekickBookmarkVisitor();
  ["bookmark_bar", "other"].forEach((path) =>
    walkEdge(json.roots[path], visit)
  );
  return bookmarks;
};
