export type Bookmark = {
  name: string;
  url: string;
  guid: string;
};

export type Node = {
  name: string;
  guid: string;
  type: string;
  url: string;
  children?: Node[];
};
