import { Box, TextField, useTheme } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import './Container.css'

const ContainerSearch = ({ searchTerm, setSearchTerm, placeholder }) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        bgcolor: theme.palette.background.paper,
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: "20px",
        display: "flex",
        alignItems: "center",
        margin:"10px",
        paddingLeft: 1,
      }}
      className="container-input"
    >
      <SearchIcon
        className="container-searchIcon"
        sx={{ color: theme.palette.text.secondary }}
      />
      <TextField
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder={placeholder}
        variant="outlined"
        sx={{
          "& .MuiOutlinedInput-root": {
            "& fieldset": { borderColor: "transparent" },
            "& .MuiInputBase-input": {
              width: { xs: "100%", md: "300px" },
              color: theme.palette.text.primary,
            },
            "&:hover fieldset": { borderColor: "transparent" },
            "&.Mui-focused fieldset": { borderColor: "transparent" },
          },
        }}
      />
    </Box>
  );
};

export default ContainerSearch;
