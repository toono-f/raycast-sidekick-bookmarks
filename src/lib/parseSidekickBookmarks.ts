import { join } from "path";
import { homedir } from "os";
import * as fs from "fs";

export type Bookmark = Pick<Node, "name" | "url" | "guid">;

type Node = {
  name: string;
  guid: string;
  type: string;
  url: string;
  children?: Node[];
};

export const parseSidekickBookmarks = (): Bookmark[] => {
  const data = fs.readFileSync(SIDEKICK_BOOKMARKS_PATH, "utf-8");

  const parsedData = JSON.parse(data) as { roots: Record<string, Node> };

  const { bookmarks, addBookmark } = bookmarkHandler();

  ["bookmark_bar", "other"].forEach((path) =>
    traverseBookmarkTree(parsedData.roots[path], addBookmark)
  );

  return bookmarks;
};

// TODO: プロファイルを選択できるようにする
const SIDEKICK_BOOKMARKS_PATH = join(
  homedir(),
  "/Library/Application Support/Sidekick/Default/Bookmarks"
  // '/Library/Application Support/Sidekick/Profile 1/Bookmarks'
);

const bookmarkHandler = () => {
  const bookmarks: Bookmark[] = [];

  const addBookmark = (bookmark: Node) => {
    bookmarks.push({
      name: bookmark.name,
      url: bookmark.url,
      guid: bookmark.guid,
    });
  };

  return { bookmarks, addBookmark };
};

const traverseBookmarkTree = (node: Node, callback: (node: Node) => void) => {
  switch (node.type) {
    case "url":
      callback(node);
      break;
    case "folder":
      node.children?.forEach((child) => traverseBookmarkTree(child, callback));
      break;
  }
};
