import { useEffect, useState } from "react";

import { getBookmarkHistory } from "../common/getBookmarkHistory";
import { AccountType, BookmarkType } from "../common/parseBookmarks";

export const useHistory = (account: AccountType) => {
  const [history, setHistory] = useState<BookmarkType[]>([]);
  useEffect(() => {
    (async () => {
      const history = await getBookmarkHistory(account);
      setHistory(history);
    })();
  }, [setHistory]);

  return history;
};
