import React, {useState} from 'react';
import MenuItem from '@mui/material/MenuItem';
import Select, {SelectChangeEvent, SelectProps} from '@mui/material/Select';
import {BoardConfig} from 'onix-board-assets';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const boardsData: BoardConfig = require('onix-board-assets/dist/js/boards.json');

type SquareSelectorProps = SelectProps<string> & {
    onChangeSquare?: (square: string) => void;
}

const SquareSelector: React.FC<SquareSelectorProps> = (props) => {

    const {onChange, onChangeSquare, value, ...other} = props;

    const [square, setSquare] = useState(value);

    const handleChange = (event: SelectChangeEvent<string>) => {
        setSquare(event.target.value);
        onChangeSquare && onChangeSquare(event.target.value);
    };

    return (
        <Select
            {...other}
            value={square}
            onChange={handleChange}
        >
            {boardsData.boardFiles.map((square) => {
                return (<MenuItem key={square.code} value={square.code}>{square.name}</MenuItem>);
            })}
        </Select>
    );
};

SquareSelector.defaultProps = {
    defaultValue: 'color-blue',
    value: 'color-blue',
};

export default SquareSelector;
