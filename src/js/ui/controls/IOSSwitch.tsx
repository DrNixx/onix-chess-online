import React, {useCallback} from 'react';
import {createTheme} from '@mui/material/styles';
import Switch, { SwitchProps } from '@mui/material/Switch';

const defaultTheme = createTheme();

type ColorPair = [string, string];
type IOSSwitchProps = Omit<SwitchProps, "focusVisibleClassName" | "disableRipple">

const IOSSwitch: React.VFC<IOSSwitchProps> = (props) => {
    const { sx, ...other } = props;

    const getColors = useCallback(() => {
        let color:ColorPair = ["#65C466", "#33cf4d"]

        switch (other.color) {
            case "primary":
                color = [defaultTheme.palette.primary.main, defaultTheme.palette.primary.light];
                break;
            case "secondary":
                color = [defaultTheme.palette.secondary.main, defaultTheme.palette.secondary.light];
                break;
            case "success":
                color = [defaultTheme.palette.success.main, defaultTheme.palette.success.light];
                break;
            case "info":
                color = [defaultTheme.palette.info.main, defaultTheme.palette.info.light];
                break;
            case "warning":
                color = [defaultTheme.palette.warning.main, defaultTheme.palette.warning.light];
                break;
            case "error":
                color = [defaultTheme.palette.error.main, defaultTheme.palette.error.light];
                break;
        }

        return color;
    }, [other.color]);

    const color1 = getColors()[0];
    const color2 = getColors()[1];

    return (
        <Switch
            focusVisibleClassName=".Mui-focusVisible"
            disableRipple
            {...other}
            sx={{
                ...sx,
                width: other.size == "small" ? 36 : 42,
                height: other.size == "small" ? 20 : 26,
                padding: 0,
                '& .MuiSwitch-switchBase': {
                    padding: 0,
                    margin: .25,
                    transitionDuration: '300ms',
                    '&.Mui-checked': {
                        transform: 'translateX(16px)',
                        color: '#fff',
                        '& + .MuiSwitch-track': {
                            backgroundColor: color1,
                            opacity: 1,
                            border: 0,
                        },
                        '&.Mui-disabled + .MuiSwitch-track': {
                            opacity: 0.5,
                        },
                    },
                    '&.Mui-focusVisible .MuiSwitch-thumb': {
                        color: color2,
                        border: '6px solid #fff',
                    },
                    '&.Mui-disabled .MuiSwitch-thumb': {
                        color:
                            defaultTheme.palette.mode === 'light'
                                ? defaultTheme.palette.grey[100]
                                : defaultTheme.palette.grey[600],
                    },
                    '&.Mui-disabled + .MuiSwitch-track': {
                        opacity: defaultTheme.palette.mode === 'light' ? 0.7 : 0.3,
                    },
                },
                '& .MuiSwitch-thumb': {
                    boxSizing: 'border-box',
                    width: other.size == "small" ? 16 : 22,
                    height: other.size == "small" ? 16 : 22
                },
                '& .MuiSwitch-track': {
                    borderRadius: other.size == "small" ? "10px" : "13px",
                    backgroundColor: defaultTheme.palette.mode === 'light'
                        ? defaultTheme.palette.grey[200]
                        : defaultTheme.palette.grey[800],
                    opacity: 1,
                    transition: defaultTheme.transitions.create(['background-color'], {
                        duration: 500,
                    }),
                }
            }}
        />
    );
};

export default IOSSwitch;