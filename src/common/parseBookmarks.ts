import { readFileSync } from "fs";
import { homedir } from "os";
import { join } from "path";

// const read = promisify(readFile);

// TODO: 全体的に最適化検討
type NodeType = {
  name: string;
  guid: string;
  type: string;
  url: string;
  children?: NodeType[];
};

export type AccountType = "default";

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

// TODO: 全プロファイルから選べるようにする
const selectAcount = (account: string) => {
  switch (account) {
    // case "work":
    //   return "/Library/Application Support/Sidekick/Profile 1/Bookmarks";
    default:
      return "/Library/Application Support/Sidekick/Default/Bookmarks";
  }
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
