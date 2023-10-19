import * as fs from "fs";
import { homedir } from "os";
import { join } from "path";

type NodeType = {
  name: string;
  guid: string;
  type: string;
  url: string;
  children?: NodeType[];
};

export type BookmarkType = Pick<NodeType, "name" | "url" | "guid">;

export const parseBookmarks = (): BookmarkType[] => {
  const data = fs.readFileSync(BOOKMARKS_PATH, "utf-8");

  const parsedData = JSON.parse(data) as { roots: Record<string, NodeType> };

  const { bookmarks, addBookmark } = bookmarkHandler();

  ["bookmark_bar", "other"].forEach((path) =>
    traverseBookmarkTree(parsedData.roots[path], addBookmark)
  );

  return bookmarks;
};

// TODO: プロファイルを選択できるようにする
const BOOKMARKS_PATH = join(
  homedir(),
  "/Library/Application Support/Sidekick/Default/Bookmarks"
  // '/Library/Application Support/Sidekick/Profile 1/Bookmarks'
);

const bookmarkHandler = () => {
  const bookmarks: BookmarkType[] = [];

  const addBookmark = (bookmark: NodeType) => {
    bookmarks.push({
      name: bookmark.name,
      url: bookmark.url,
      guid: bookmark.guid,
    });
  };

  return { bookmarks, addBookmark };
};

const traverseBookmarkTree = (
  node: NodeType,
  callback: (node: NodeType) => void
) => {
  switch (node.type) {
    case "url":
      callback(node);
      break;
    case "folder":
      node.children?.forEach((child) => traverseBookmarkTree(child, callback));
      break;
  }
};
