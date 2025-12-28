import {
  Dialog,
  Tab,
  TabPanel,
  Tabs,
  TabsBody,
  TabsHeader,
} from "@material-tailwind/react";
import { useAvatarEditorDialog } from "./AvatarEditorDialogContext";
import { FaShirt } from "react-icons/fa6";
import { IoIosColorPalette } from "react-icons/io";
import { avatarOptions } from "../../../helper/avatar";
import Avatar, { Piece } from "avataaars";
import { useState } from "react";
import { BsSunglasses } from "react-icons/bs";

const AvatarEditorDialog = () => {
  const { open, closeDialog, updateAvatar, avatarConfig } = useAvatarEditorDialog();
  const [activeTab, setActiveTab] = useState("Hair");

  const data = [
    { label: "Hair", value: "Hair" },
    { label: "Color", value: "Color" },
    { label: "Clothes", value: "Clothes" },
    { label: "Accessories", value: "Accessories" },
    { label: "Face", value: "Face" },
  ];

  const panels = {
    Hair: ["topType"],
    Color: ["skinColor", "hairColor"],
    Clothes: ["clotheType", "clotheColor"],
    Accessories: ["accessoriesType"],
    Face: ["mouthType", "eyebrowType"],

  };

  const mapToPieceComponent = (pieceType) => {
    if (pieceType.includes("eyebrow")) return "eyebrows";
    if (pieceType.includes("mouth")) return "mouth";
    if (pieceType.includes("top")) return "top";
    if (pieceType.includes("clothe")) return "clothe";
    if (pieceType.includes("accessories")) return "accessories";
    if (pieceType.includes("skin")) return "skin";
    if (pieceType.includes("hairColor")) return "top";
    return "top";
  };

  if (!open || !avatarConfig) return null;

  return (
    <Dialog
      open={open}
      handler={closeDialog}
      size="xs"
      animate={{ mount: { scale: 1, y: 0 }, unmount: { scale: 0.9, y: -100 } }}
      className="border-2 pt-3 border-main-dark"
    >
      <div className="flex w-full justify-center items-center">
        <Avatar
          style={{ width: "150px", height: "150px", marginBottom: "20px" }}
          avatarStyle="Circle"
          {...avatarConfig}
        />
      </div>

      <Tabs value={activeTab}>
        <TabsHeader
          className="rounded-none border-b w-[100%] flex h-14 justify-start items-center  border-blue-gray-50 p-0"
          indicatorProps={{
            className:
              "bg-transparent border-b-4 border-main-dark shadow-none rounded-[3px]",
          }}
        >
          {data.map(({ label, value }) => (
            <Tab
              key={value}
              value={value}
              onClick={() => setActiveTab(value)}
              className={` h-full ${activeTab === value ? "text-main-dark" : ""}`}
            >
              {label === "Hair" ? (
                <img src={`/student/${label}.svg`} alt="" />
              ) : label === "Color" ? (
                <IoIosColorPalette size={30} color="#545454" />
              ) : label === "Clothes" ? (
                <FaShirt size={30} color="#545454" />
              ) :label === "Accessories" ?(
                      <BsSunglasses />
                ): (
                <img src={`/student/${label}.png`} alt="" />
              )}
            </Tab>
          ))}
        </TabsHeader>
        <TabsBody className="border-t bg-main-light border-black/20">
          {Object.entries(panels).map(([tabValue, pieceTypes]) => (
            <TabPanel key={tabValue} value={tabValue}>
              {pieceTypes.map((pieceType) => (
                <div key={pieceType}>
                  <div className="grid grid-cols-6 gap-2 place-content-center w-fit">
                    {avatarOptions[pieceType].map((option) => (
                      <div
                        onClick={() => updateAvatar({ [pieceType]: option })}
                        className={`${
                          avatarConfig[pieceType] === option
                            ? "border-2 border-black/30 w-full bg-black/30 rounded-xl"
                            : ""
                        } flex justify-center items-center z-50`}
                        key={option}
                      >
                        <Piece
                          style={{ width: "150px", height: "50px" }}
                          pieceType={mapToPieceComponent(pieceType)}
                          pieceSize="80"
                          {...{ [pieceType]: option }}
                          {...(pieceType === "topType" && {
                            hairColor: avatarConfig.hairColor,
                          })}
                          {...(pieceType === "clotheType" && {
                            clotheColor: avatarConfig.clotheColor,
                          })}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </TabPanel>
          ))}
        </TabsBody>
      </Tabs>
    </Dialog>
  );
};

export default AvatarEditorDialog;
