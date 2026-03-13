// Defines the structure of a Photo object with id, title, and url properties.
type Photo = {
  id: number;
  filename: string;
  stored_filename: string;
  mime_type: string;
  file_size: number;
  title: string | null;
  description: string | null;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
  image_url: string;
};

export default Photo;
