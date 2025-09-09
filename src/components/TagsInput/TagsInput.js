import React from "react";
import { Autocomplete, Chip, TextField, Box } from "@mui/material";

const TagsInput = ({ selectedTags, setSelectedTags, isLoading }) => {
  const predefinedTags = [];

  return (
    <Box mt={2}>
      <Autocomplete
        multiple
        freeSolo
        options={predefinedTags}
        value={selectedTags}
        onChange={(event, value) => setSelectedTags(value)}
        renderTags={(value, getTagProps) =>
          value.map((option, index) => (
            <Chip key={index} label={option} {...getTagProps({ index })} />
          ))
        }
        renderInput={(params) => (
          <TextField
            disabled={isLoading}
            {...params}
            label="Tags"
            placeholder="Add Tags"
          />
        )}
      />
    </Box>
  );
};

export default TagsInput;
    