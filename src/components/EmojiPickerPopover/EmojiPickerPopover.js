// src/components/EmojiPickerPopover.js
import React from "react";
import { Popover } from "@mui/material";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";

function EmojiPickerPopover({ anchorEl, onClose, onEmojiSelect }) {
  const open = Boolean(anchorEl);

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      transformOrigin={{ vertical: "bottom", horizontal: "right" }}
    >
      <Picker data={data} onEmojiSelect={onEmojiSelect} />
    </Popover>
  );
}

export default EmojiPickerPopover;
