import { readFileSync } from "fs";
import { homedir } from "os";
import { join } from "path";
// const read = promisify(readFile);

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
  const bookmarkPath = join(homedir(), selectAcount(account));

  const data = readFileSync(bookmarkPath, "utf-8");

  const parsedData = JSON.parse(data) as { roots: Record<string, NodeType> };

  const { bookmarks, addBookmark } = bookmarkHandler();

  ["bookmark_bar", "other"].forEach((path) =>
    traverseBookmarkTree(parsedData.roots[path], addBookmark)
  );

  return bookmarks;
};

const selectAcount = (account: AccountType) => {
  // TODO: 今は手動で以下に設定する設定する必要がある
  if (account === "profile") {
    return "/Library/Application Support/Sidekick/Profile 1/Bookmarks";
  }
  return "/Library/Application Support/Sidekick/Default/Bookmarks";
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

// TODO: プロファイルを取得したい場合は以下を参考にする
// export async function getChromiumProfiles(path: string) {
//   if (!existsSync(`${path}/Local State`)) {
//     return { profiles: [], defaultProfile: "" };
//   }

//   const file = await read(`${path}/Local State`, "utf-8");
//   const localState = JSON.parse(file);

//   const profileInfoCache: Record<string, any> = localState.profile.info_cache;

//   const profiles = Object.entries(profileInfoCache)
//     // Only keep profiles that have bookmarks
//     .filter(([profilePath]) => {
//       const profileDirectory = readdirSync(`${path}/${profilePath}`);
//       return profileDirectory.includes("Bookmarks");
//     })
//     .map(([path, profile]) => {
//       return {
//         path,
//         name: profile.name,
//       };
//     });

//   const defaultProfile =
//     localState.profile?.last_used?.length > 0
//       ? localState.profile.last_used
//       : profiles[0].path;

//   profiles.sort((a, b) => a.name.localeCompare(b.name));
//   return { profiles, defaultProfile };
// }
