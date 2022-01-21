export type Site = {
  title: string;
  description?: string;
  url: string;
  tags?: string[];
  github?: {
    owner: string;
    name: string;
  };
};
