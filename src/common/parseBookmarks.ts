import path from "path";
import { getPreferenceValues } from "@raycast/api";
import { readFileSync } from "fs";
import { defaultProfilePathSidekick } from "./constants";

interface Preferences {
  readonly profilePathSidekick?: string;
}

type NodeType = {
  name: string;
  guid: string;
  type: string;
  url: string;
  children?: NodeType[];
};

export type AccountType = "default" | "profile";

export type BookmarkType = Pick<NodeType, "name" | "url" | "guid">;

export const parseBookmarks = (account: AccountType): BookmarkType[] => {
  const bookmarkPath = selectAcount(account);

  const data = readFileSync(bookmarkPath, "utf-8");

  const parsedData = JSON.parse(data) as { roots: Record<string, NodeType> };

  const { bookmarks, addBookmark } = bookmarkHandler();

  ["bookmark_bar", "other"].forEach((path) =>
    traverseBookmarkTree(parsedData.roots[path], addBookmark)
  );

  return bookmarks;
};

const userLibraryDirectoryPath = () => {
  if (!process.env.HOME) {
    throw new Error("$HOME environment variable is not set.");
  }

  return path.join(process.env.HOME, "Library");
};

const selectAcount = (account: AccountType) => {
  const { profilePathSidekick } = getPreferenceValues<Preferences>();
  const userDataDirectory = userLibraryDirectoryPath();

  if (profilePathSidekick && account === "profile") {
    return path.join(profilePathSidekick, "Bookmarks");
  }
  return path.join(userDataDirectory, ...defaultProfilePathSidekick);
};

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
