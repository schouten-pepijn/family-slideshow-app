import { PhotoListItem } from "./PhotoListItem";
import type { Photo } from "../../types/photo";
import type { Collection } from "../../types/collection";

type PhotoListProps = {
  photos: Photo[];
  collections: Collection[];
  selectedPhotoId: number | null;
  onSelectPhoto: (photo: Photo) => void;
  onToggleActive: (photoId: number) => Promise<void>;
  onRemovePhoto: (photoId: number) => Promise<void>;
};

export function PhotoList(props: PhotoListProps) {
  return (
    <div className="grid gap-4">
      {props.photos.map((photo) => (
        <PhotoListItem
          key={photo.id}
          photo={photo}
          collections={props.collections}
          isSelected={props.selectedPhotoId === photo.id}
          onSelectPhoto={props.onSelectPhoto}
          onToggleActive={props.onToggleActive}
          onRemovePhoto={props.onRemovePhoto}
        />
      ))}
    </div>
  );
}
