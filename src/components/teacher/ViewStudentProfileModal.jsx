import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Button,
  Card,
  Typography,
  Chip,
  IconButton,
} from "@material-tailwind/react";
import { AiOutlineClose } from "react-icons/ai";
import Avatar from "@mui/material/Avatar";

export default function ViewProfileModal({ open, onClose, user = {} }) {
  const safeUser = user || {};

  if (safeUser.avatar) {
    return <Avatar src={safeUser.avatar} alt={safeUser.full_name} size="md" variant="circular" />;
  }
// fallback: show initials or "?" when no image
  const initials = safeUser.full_name
    ? safeUser.full_name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "?";

  return (
    <Dialog
      size="lg"
      open={open}
      handler={onClose}
      className="bg-transparent shadow-none"
    >
      <Card className="p-4 md:p-6 rounded-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <DialogHeader className="text-[#1c96c5]">
            {safeUser.avatar && (
              <Avatar sx={{ width: 34, height: 34 }} variant="circular">
            {initials}
          </Avatar>
            )}
            View Profile
          </DialogHeader>
          <IconButton variant="text" onClick={onClose}>
            <AiOutlineClose className="h-5 w-5 text-gray-600" />
          </IconButton>
        </div>

        <DialogBody className="space-y-6">
          {/* Avatar displayed separately */}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(safeUser)
              .filter(([key]) => key !== "avatar") // exclude avatar here
              .map(([key, value]) => (
                <ProfileRow
                  key={key}
                  label={key
                    .replace(/_/g, " ")
                    .replace(/([A-Z])/g, " $1")
                    .replace(/^./, (str) => str.toUpperCase())}
                  value={value || "N/A"}
                />
              ))}
          </div>
        </DialogBody>

        <DialogFooter>
          <Button variant="text" color="gray" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </Card>
    </Dialog>
  );
}

function ProfileRow({ label, value, chip = false }) {
  return (
    <div>
      <Typography variant="small" className="text-blue-gray-500 mb-1">
        {label}
      </Typography>
      {chip ? (
        <Chip
          value={value}
          className="bg-[#1c96c5] text-white w-fit"
          size="sm"
        />
      ) : (
        <Typography className="font-medium text-blue-gray-800">
          {value}
        </Typography>
      )}
    </div>
  );
}
