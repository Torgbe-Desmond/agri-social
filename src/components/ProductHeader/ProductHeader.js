import { Box } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import './ProductHeader.css'


const ProductHeader = ({ handleGoBack }) => (
  <Box className="product-header">
    <h2>
      <ArrowBackIcon cursor="pointer" onClick={handleGoBack} />
      <span>Product</span>
    </h2>
  </Box>
);

export default ProductHeader;
