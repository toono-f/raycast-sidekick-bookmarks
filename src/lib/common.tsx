import { join } from "path";
import { homedir } from "os";
import * as fs from "fs";
import { Bookmark } from "../types";

export const filterBookmarks = (bookmarks: Bookmark[], searchText: string) => {
  if (!searchText) return bookmarks;
  const searchLower = searchText.toLowerCase();
  return bookmarks.filter(
    (bookmark) => bookmark.name.toLowerCase().includes(searchLower) || bookmark.url.toLowerCase().includes(searchLower)
  );
};

type Node = {
  name: string;
  guid: string;
  type: string;
  url: string;
  children?: Node[];
};
const BOOKMARKS_PATH = join(homedir(), "/Library/Application Support/Sidekick/Default/Bookmarks");
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
const parseSidekickBookmarks = (): Bookmark[] => {
  const data = fs.readFileSync(BOOKMARKS_PATH, "utf-8");
  const json = JSON.parse(data);
  const parser = new SidekickBookmarkVisitor();
  ["bookmark_bar", "other"].forEach((path) => walkEdge(json.roots[path], parser));
  return parser.bookmarks;
};
export const allBookmarks = parseSidekickBookmarks();
