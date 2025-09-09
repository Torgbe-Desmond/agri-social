import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
} from "@mui/material";
import { popComponent } from "../../Features/StackSlice";
import { useDispatch } from "react-redux";

function SellerInfoModal({}) {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    description: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    setFormData({
      name: "",
      phone: "",
      email: "",
      description: "",
    });
  };

  return (
    <Dialog
      open={true}
      onClose={() => dispatch(popComponent())}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>Seller Information</DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="column" gap={2} mt={1}>
          <TextField
            label="Full Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Phone Number"
            name="phone"
            type="number"
            value={formData.phone}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Email (optional)"
            name="email"
            value={formData.email}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            multiline
            label="What i sell"
            name="description"
            value={formData.description}
            onChange={handleChange}
            fullWidth
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => dispatch(popComponent())} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default SellerInfoModal;
