export type Collection = {
  id: number;
  name: string;
  description: string | null;
  is_public: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
  photo_count?: number;
  photo_ids?: number[];
};
