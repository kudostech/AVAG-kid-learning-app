import { createContext, useContext, useState } from "react";

const AvatarEditorDialogContext = createContext(undefined);

export const AvatarEditorDialogProvider = ({ children }) => {
  const [open, setOpen] = useState(false);
  const defaultAvatarConfig = {
  topType: "ShortHairDreads01",
  accessoriesType: "Round",
  hairColor: "Black",
  facialHairType: "Blank",
  facialHairColor: "BlondeGolden",
  clotheColor: "Black",
  eyeType: "Default",
  eyebrowType: "Default",
  mouthType: "Smile",
  skinColor: "Light",
  clotheType: "Hoodie",
};

const [avatarConfig, setAvatarConfig] = useState(defaultAvatarConfig);

const closeDialog = () => {
  setOpen(false);
  setAvatarConfig(defaultAvatarConfig); // instead of null
};


  const openDialog = () => {
    setOpen(true);
  };


  const updateAvatar = (updated) => {
    setAvatarConfig((prev) => (prev ? { ...prev, ...updated } : null));
  };

  return (
    <AvatarEditorDialogContext.Provider
      value={{ open, avatarConfig, openDialog, closeDialog, updateAvatar }}
    >
      {children}
    </AvatarEditorDialogContext.Provider>
  );
};

export const useAvatarEditorDialog = () => {
  const context = useContext(AvatarEditorDialogContext);
  if (!context) {
    throw new Error("useAvatarEditorDialog must be used within AvatarEditorDialogProvider");
  }
  return context;
};
