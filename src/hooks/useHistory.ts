import { useEffect, useState } from "react";

import { getBookmarkHistoryFromLocalStorage } from "../lib/getBookmarkHistoryFromLocalStorage";
import { BookmarkType } from "../lib/parseBookmarks";

export const useHistory = () => {
  const [history, setHistory] = useState<BookmarkType[]>([]);
  useEffect(() => {
    (async () => {
      const history = await getBookmarkHistoryFromLocalStorage();
      setHistory(history);
    })();
  }, [setHistory]);

  return history;
};
