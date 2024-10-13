import React from 'react';
import { useSlate } from 'slate-react';

import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';

import { CustomEditor } from '../../types/editors';
import { MarkTypes } from '../../types/marks';
import { FormatElementType } from '../../types/blocks';

import CropSquareOutlined from '@mui/icons-material/CropSquareOutlined';
import { applyDefaults, defaultOf } from '../../../../utils/propsUtils';
import { isFormatIsAlignment } from '../../plugins/blocks/withBlocks';

type buttonFormat = MarkTypes | FormatElementType | 'custom';
type buttonTyle = 'mark' | 'block' | 'link' | 'custom';
type placementType =
    | 'bottom-end'
    | 'bottom-start'
    | 'bottom'
    | 'left-end'
    | 'left-start'
    | 'left'
    | 'right-end'
    | 'right-start'
    | 'right'
    | 'top-end'
    | 'top-start'
    | 'top';

export type ToolbarButtonProps = Omit<IconButtonProps, 'type' | 'disabled' | 'onMouseDown'> & {
    tooltip?: string;
    placement?: placementType;
    icon: string | React.JSX.Element;
    type: buttonTyle;
    format?: buttonFormat;
    disabled?: boolean;
    disableOnSelection?: boolean;
    disableOnCollapse?: boolean;
    onMouseDown?: (editor: CustomEditor, format: buttonFormat, type: buttonTyle) => void;
    isActive?: () => boolean;
};

type propsWithDefaults = 'placement' | 'format' | 'icon' | 'disableOnCollapse' | 'disableOnSelection' | 'onMouseDown';
const defaultProps: defaultOf<ToolbarButtonProps, propsWithDefaults> = {
    placement: 'top' as placementType,
    format: 'custom' as buttonFormat,
    icon: <CropSquareOutlined />,
    disableOnCollapse: false,
    disableOnSelection: false,
    onMouseDown: () => {},
};

const ToolbarButton: React.FC<ToolbarButtonProps> = (propsIn) => {
    const props = applyDefaults(propsIn, defaultProps);
    const {
        ref,
        format,
        type,
        icon,
        tooltip,
        placement,
        isActive,
        disabled,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        disableOnSelection,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        disableOnCollapse,
        onMouseDown,
        ...rest
    } = props;

    const editor: CustomEditor = useSlate();

    /**
     * If no tooltip prop is passed it generates a default based on the format string.
     * Converts - into spaces and uppercases the first letter of the first word.
     */
    const defaultTooltip = () => {
        const s = format as string;
        return (s.charAt(0).toUpperCase() + s.substring(1)).replace('-', ' ');
    };

    const checkIsActive = () => {
        if (isActive) {
            return isActive();
        }

        switch (type) {
            case 'mark':
                return editor.isMarkActive(format as MarkTypes);
            case 'block':
                return editor.isBlockActive(format ?? 'custom', isFormatIsAlignment(format) ? 'align' : undefined);
            case 'link':
                return editor.isNodeTypeActive(format ?? 'custom');
        }

        return false;
    };

    /**
     * Conditionally disables the button
     */
    const isDisabled = () => {
        //let disabled = disableOnSelection ? editor.isSelectionExpanded() : false;
        //disabled = disableOnCollapse ? editor.isSelectionCollapsed() : disabled;
        return disabled;
    };

    return (
        <Tooltip title={tooltip ? tooltip : defaultTooltip()} placement={placement}>
            <IconButton
                aria-label={tooltip ? tooltip : defaultTooltip()}
                ref={ref}
                color={checkIsActive() ? 'secondary' : 'default'}
                onMouseDown={(event) => {
                    event.preventDefault();
                    switch (type) {
                        case 'mark':
                            editor.toggleMark(format as MarkTypes);
                            break;
                        case 'block':
                            editor.toggleBlock(format);
                    }

                    onMouseDown(editor, format, type);
                }}
                disabled={disabled || isDisabled()}
                {...rest}
            >
                {icon}
            </IconButton>
        </Tooltip>
    );
};

export default ToolbarButton;
