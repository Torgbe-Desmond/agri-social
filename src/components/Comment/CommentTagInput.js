// CommentTagInput.js
import { Autocomplete, Chip, TextField } from "@mui/material";
import { useTheme } from "@mui/material/styles";

const CommentTagInput = ({ selectedTags, setSelectedTags, isAddingComment }) => {
  const theme = useTheme();
  const predefinedTags = [];

  const handleTagChange = (event, value) => {
    setSelectedTags(value);
  };

  return (
    <Autocomplete
      multiple
      freeSolo
      options={predefinedTags}
      value={selectedTags}
      onChange={handleTagChange}
      size="small"
      renderTags={(value, getTagProps) =>
        value.map((option, index) => (
          <Chip
            size="small"
            variant="outlined"
            label={option}
            {...getTagProps({ index })}
            key={index}
            sx={{ fontSize: "0.7rem", height: 24 }}
          />
        ))
      }
      renderInput={(params) => (
        <TextField
          {...params}
          variant="outlined"
          disabled={isAddingComment}
          placeholder="Tags"
          size="small"
          sx={{
            "& .MuiOutlinedInput-root": {
              height: 36,
              color: theme.palette.text.primary,
              backgroundColor:
                theme.palette.mode === "dark"
                  ? theme.palette.background.default
                  : "#f9f9f9",
              "& fieldset": { borderColor: "transparent" },
              "&:hover fieldset": { borderColor: "transparent" },
              "&.Mui-focused fieldset": {
                borderColor: theme.palette.primary.main,
              },
            },
            input: {
              color: theme.palette.text.primary,
            },
          }}
        />
      )}
    />
  );
};

export default CommentTagInput;
