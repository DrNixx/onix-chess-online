import React, {useState} from 'react';
import toSafeInteger from 'lodash/toSafeInteger';
import MenuItem from '@mui/material/MenuItem';
import Select, {SelectChangeEvent, SelectProps} from '@mui/material/Select';
import { BoardSize, BoardConfig } from 'onix-board-assets';

const boardsData: BoardConfig = require('onix-board-assets/dist/js/boards.json');

type SizeSelectorProps = SelectProps<BoardSize> & {
    onChangeSize?: (size: BoardSize) => void;
}

const SizeSelector: React.FC<SizeSelectorProps> = (props) => {
    const {onChange, onChangeSize, value, ...other} = props;

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
                return (<MenuItem value={size.idx}>{size.name}</MenuItem>);
            })}
        </Select>
    );
}

SizeSelector.defaultProps = {
    defaultValue: BoardSize.Normal,
    value: BoardSize.Normal
};

export default SizeSelector;
