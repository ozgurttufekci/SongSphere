import React from 'react';
import { SvgIcon } from '@mui/material';
import SoundSphereLogo from '../assets/logo.svg?react';

function SoundSphereIcon(props) {
    return (
        <SvgIcon component={SoundSphereLogo} inheritViewBox sx={{ width: 48, height: 48 }} {...props} />
    );
}

export default SoundSphereIcon;