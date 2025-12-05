export interface Tag {
  icon?: string;
  id: string;
  value: string;
}
export type Book = {
  id: string;
  title: string;
  src?: string;
  price?: string;
  rating?: number;
  description?: string;
  longDescription?: string;
  tags?: Tag[];
};

export interface Group {
  id: string;
  name: string;
  description: string;
  iconUrl?: string;
  membersCount: number;
  lastActiveAt: string;
  url: string;
}

export interface GroupTag {
  name: string;
  url: string;
}

export interface GroupDetail extends Group {
  fullDescription?: string;
  rules?: string[];
  moderators?: string[];
  topics?: {
    id: string;
    title: string;
    author: string;
    lastPostAt: string;
    postsCount: number;
  }[];
  relatedBooks?: Book[];
}
