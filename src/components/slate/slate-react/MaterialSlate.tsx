import React, {PropsWithChildren, useCallback, useState, useMemo} from 'react';
import clsx from 'clsx';

import { Slate } from 'slate-react';
import { Descendant } from 'slate';

import Box from '@mui/material/Box';
import { SxProps } from '@mui/system';
import {Theme, useTheme} from '@mui/material/styles';
import FormHelperText from '@mui/material/FormHelperText';

import { CustomEditor } from '../types/editors';
import {defaultOf, applyDefaults} from "../../../utils/propsUtils";
import deepMerge from "../../../utils/deepMerge";

type Props = {
    value: Descendant[];
    error?: boolean;
    helperText?: string;
    editor: CustomEditor;
    onChange?: (value: Descendant[]) => void;
    variant?: 'outlined' | 'filled' | 'standard',
    sx?: SxProps<Theme>;
};

type propsWithDefaults = 'variant' | 'sx';
const defaultProps: defaultOf<PropsWithChildren<Props>, propsWithDefaults> = {
    variant: 'standard',
    sx: {}
};

const MaterialSlate: React.FC<PropsWithChildren<Props>> = (propsIn) => {
    const props = applyDefaults(propsIn, defaultProps);
    const {
        editor,
        value,
        variant,
        sx,
        error,
        helperText,
        onChange,
        children
    } = props;

    const theme = useTheme();
    const [isFocused, setIsFocused] = useState(false);

    const light = useMemo(() => theme.palette.mode === 'light', [theme.palette.mode]);

    const sxOutlined = useCallback(() => {
        const result: SxProps<Theme> = {
            borderRadius: 1,
            border: '1px solid',
            borderColor: 'grey.400',
            '&:hover': {
                borderColor: 'text.primary',
            },

            '&.focused': {
                borderColor: 'primary.main',
                borderWidth: 2,
                '&:hover': {
                    borderColor: 'primary.main',
                },
            },

            '&.error': {
                borderColor: 'error.light',

                '&:hover': {
                    borderColor: 'error.main',
                },

                '&.focused': {
                    borderColor: 'error.main',
                    borderWidth: 2,
                    '&:hover': {
                        borderColor: 'error.main',
                    },
                },
            },
        };

        return result;
    }, []);

    const sxFilled = useCallback(() => {
        const result: SxProps<Theme> = {
            backgroundColor: light ? 'rgba(0, 0, 0, 0.06)' : 'rgba(255, 255, 255, 0.09)',
            borderRadius: 0,
            borderBottom: '1px solid',
            borderBottomColor: light ? 'rgba(0, 0, 0, 0.42)' : 'rgba(255, 255, 255, 0.7)',
            '&:hover': {
                backgroundColor: light ? 'rgba(0, 0, 0, 0.09)' : 'rgba(255, 255, 255, 0.13)',
                borderBottomColor: 'text.primary',
            },

            '&.focused': {
                borderBottomColor: 'primary.main',
                borderWidth: 2,
                '&:hover': {
                    borderBottomColor: 'primary.main',
                },
            },

            '&.error': {
                borderBottomColor: 'error.light',

                '&:hover': {
                    borderBottomColor: 'error.main',
                },

                '&.focused': {
                    borderBottomColor: 'error.main',
                    borderWidth: 2,
                    '&:hover': {
                        borderBottomColor: 'error.main',
                    },
                },
            },
        };

        return result;
    }, [light]);

    const sxStandard = useCallback(() => {
        const result: SxProps<Theme> = {
            borderRadius: 0,
            borderBottom: '2px solid',
            borderBottomColor: 'rgba(0, 0, 0, 0)',

            '&.error': {
                borderBottomColor: 'error.light',

                '&:hover': {
                    borderBottomColor: 'error.main',
                },

                '&.focused': {
                    borderBottomColor: 'error.main',
                    '&:hover': {
                        borderBottomColor: 'error.main',
                    },
                },
            }
        };

        return result;
    }, []);

    const sxWithVariant = useCallback((): SxProps<Theme> => {
        let sxBase: SxProps<Theme>;
        switch (variant) {
            case "outlined":
                sxBase = sxOutlined();
                break;
            case "filled":
                sxBase = sxFilled();
                break;
            case "standard":
                sxBase = sxStandard();
                break;
        }

        return deepMerge(sxBase, sx ?? {});
    }, [sx, variant, sxOutlined, sxFilled, sxStandard]);

    return (
        <Box
            sx={sxWithVariant()}
            className={clsx({ error: error, focused: isFocused })}
            onBlur={() => setIsFocused(false)}
            onFocus={() => setIsFocused(true)}
        >
            <Slate initialValue={value} editor={editor} onChange={(value) => onChange && onChange(value)}>
                {children}
            </Slate>
            {!!helperText && <FormHelperText>{helperText}</FormHelperText>}
        </Box>
    );
};

export default MaterialSlate;
