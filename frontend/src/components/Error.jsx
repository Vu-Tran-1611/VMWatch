import React from "react";
import Alert from "@mui/material/Alert";
import { Box } from "@mui/material";

const Error = ({ errorMessage }) => {
    // Handle both string and error object
    const message = typeof errorMessage === 'string'
        ? errorMessage
        : errorMessage?.message || 'An error occurred';

    return (
        <Box margin="20px 200px">
            <Alert severity="error">{message}</Alert>
        </Box>
    );
};

export default Error;
