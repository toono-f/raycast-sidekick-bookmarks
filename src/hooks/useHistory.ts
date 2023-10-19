import { useEffect, useState } from "react";

import { getBookmarkHistoryFromLocalStorage } from "../lib/getBookmarkHistoryFromLocalStorage";
import { Bookmark } from "../lib/parseSidekickBookmarks";

export const useHistory = () => {
  const [history, setHistory] = useState<Bookmark[]>([]);
  useEffect(() => {
    (async () => {
      const history = await getBookmarkHistoryFromLocalStorage();
      setHistory(history);
    })();
  }, [setHistory]);

  return history;
};
