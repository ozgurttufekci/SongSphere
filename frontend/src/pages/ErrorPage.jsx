import React, { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import SoundSphereIcon from "../components/SoundSphereIcon";
import { IconButton, Typography, Box } from "@mui/material";
import { useRouteError } from "react-router-dom";

export default function ErrorPage() {
    const error = useRouteError();

    return (
        <>
            <NavBar />
            <Box
                id="error-page"
                sx={{
                    paddingTop: '64px',
                    textAlign: 'center',
                    color: 'text.primary',
                    px: 2 // Add horizontal padding for better spacing
                }}
            >
                <IconButton href="/">
                    <SoundSphereIcon sx={{ width: 100, height: 100 }} />
                </IconButton>
                <Typography variant="h2" gutterBottom>
                    Oops!
                </Typography>
                <Typography variant="h5" gutterBottom>
                    Sorry, an unexpected error has occurred.
                </Typography>
                <Typography variant="body1" sx={{ color: 'error.main', fontWeight: 'bold' }}>
                    <i>{`${error.status || ''} ${error.statusText || ''} ${error.message || ''}`}</i>
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
                    <i>{`${error.data || ''}`}</i>
                </Typography>
            </Box>
        </>
    );
}
