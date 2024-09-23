import React, {useState} from 'react';
import MenuItem from '@mui/material/MenuItem';
import Select, {BaseSelectProps, SelectChangeEvent} from '@mui/material/Select';
import {defaultOf} from "../../utils/propsUtils";

import boardsData from 'onix-board-assets/dist/js/boards.json';
import {useDefaults} from "../../hooks/useDefaults";

type SquareSelectorProps = BaseSelectProps<string> & {
    onChangeSquare?: (square: string) => void;
}

type propsWithDefaults = 'defaultValue' | 'value' | 'variant';
const defaultProps: defaultOf<SquareSelectorProps, propsWithDefaults> = {
    defaultValue: 'color-blue',
    value: 'color-blue',
    variant: 'outlined',
};

const SquareSelector: React.FC<SquareSelectorProps> = (propsIn) => {
    const props = useDefaults(propsIn, defaultProps);
    const {
        onChangeSquare,
        value,
        ...other
    } = props;

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

export default SquareSelector;
