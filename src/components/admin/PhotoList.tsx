import type { FormEvent } from "react";
import { PhotoListItem } from "./PhotoListItem";
import type { Photo } from "../../types/photo";

type PhotoListProps = {
  photos: Photo[];
  editingPhotoId: number | null;
  editTitle: string;
  editDescription: string;
  onEditTitleChange: (value: string) => void;
  onEditDescriptionChange: (value: string) => void;
  onStartEditing: (
    photoId: number,
    title: string | null,
    description: string | null,
  ) => void;
  onCancelEditing: () => void;
  onSavePhotoDetails: (
    event: FormEvent<HTMLFormElement>,
    photoId: number,
  ) => Promise<void>;
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
          isEditing={props.editingPhotoId === photo.id}
          editTitle={props.editTitle}
          editDescription={props.editDescription}
          onEditTitleChange={props.onEditTitleChange}
          onEditDescriptionChange={props.onEditDescriptionChange}
          onStartEditing={props.onStartEditing}
          onCancelEditing={props.onCancelEditing}
          onSavePhotoDetails={props.onSavePhotoDetails}
          onToggleActive={props.onToggleActive}
          onRemovePhoto={props.onRemovePhoto}
        />
      ))}
    </div>
  );
}
