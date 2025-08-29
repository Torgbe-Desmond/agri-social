import { Box, Typography, Stack } from "@mui/material";
import {
  LocationOn as LocationOnIcon,
  Phone as PhoneIcon,
} from "@mui/icons-material";

const ProductInfo = ({ product }) => (
  <Box px={2} pb={2}>
    {product?.contact && (
      <Stack direction="row" alignItems="center" spacing={1} mt={1}>
        <PhoneIcon fontSize="small" />
        <Typography variant="body2">{product.contact}</Typography>
      </Stack>
    )}

    {product?.city && (
      <Stack direction="row" alignItems="center" spacing={1} mt={1}>
        <LocationOnIcon fontSize="small" />
        <Typography variant="body2">{product.city}</Typography>
      </Stack>
    )}
  </Box>
);

export default ProductInfo;
