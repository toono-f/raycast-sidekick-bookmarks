import { useEffect, useState } from "react";

import { getBookmarkHistory } from "../common/getBookmarkHistory";
import { BookmarkType } from "../common/parseBookmarks";

export const useHistory = () => {
  const [history, setHistory] = useState<BookmarkType[]>([]);
  useEffect(() => {
    (async () => {
      const history = await getBookmarkHistory();
      setHistory(history);
    })();
  }, [setHistory]);

  return history;
};
