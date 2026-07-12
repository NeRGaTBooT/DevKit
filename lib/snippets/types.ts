export interface SnippetCategory {
  id: string;
  label: string;
}

export interface SnippetItem {
  id: string;
  category: string;
  title: string;
  description: string;
  language: string;
  code: string;
  tags?: string[];
}
