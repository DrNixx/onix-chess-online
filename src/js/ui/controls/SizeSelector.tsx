import React, {useState} from 'react';
import toSafeInteger from 'lodash/toSafeInteger';
import MenuItem from '@mui/material/MenuItem';
import Select, {SelectChangeEvent, BaseSelectProps} from '@mui/material/Select';
import { BoardSize, BoardConfig } from 'onix-board-assets';
import {applyDefaults, defaultOf} from "../../utils/propsUtils";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const boardsData: BoardConfig = require('onix-board-assets/dist/js/boards.json');

type SizeSelectorProps = BaseSelectProps<BoardSize> & {
    onChangeSize?: (size: BoardSize) => void;
}

type propsWithDefaults = 'defaultValue' | 'value' | 'variant';
const defaultProps: defaultOf<SizeSelectorProps, propsWithDefaults> = {
    defaultValue: BoardSize.Normal,
    value: BoardSize.Normal,
    variant: 'outlined',
};

const SizeSelector: React.FC<SizeSelectorProps> = (propsIn) => {
    const {
        onChangeSize,
        value,
        ...other
    } = applyDefaults(propsIn, defaultProps);

    const [size, setSize] = useState(value);

    const handleChange = (event: SelectChangeEvent<BoardSize>) => {
        const newSize = toSafeInteger(event.target.value);
        setSize(newSize);
        onChangeSize && onChangeSize(newSize);
    };

    return (
        <Select
            {...other}
            value={size}
            onChange={handleChange}
        >
            {boardsData.boardSizes.map((size) => {
                return (<MenuItem key={size.idx} value={size.idx}>{size.name}</MenuItem>);
            })}
        </Select>
    );
}

export default SizeSelector;
