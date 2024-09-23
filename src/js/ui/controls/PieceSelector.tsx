import React, {useState} from 'react';
import MenuItem from '@mui/material/MenuItem';
import Select, {BaseSelectProps, SelectChangeEvent} from '@mui/material/Select';
import {defaultOf} from "../../utils/propsUtils";

import piecesData from 'onix-board-assets/dist/js/pieces.json';
import {useDefaults} from "../../hooks/useDefaults";

type PieceSelectorProps =  BaseSelectProps<string> & {
    onChangePiece?: (piece: string) => void;
}

type propsWithDefaults = 'defaultValue' | 'value' | 'variant';
const defaultProps: defaultOf<PieceSelectorProps, propsWithDefaults> = {
    defaultValue: 'merida',
    value: 'merida',
    variant: 'outlined',
};

const PieceSelector: React.FC<PieceSelectorProps> = (propsIn) => {
    const props = useDefaults(propsIn, defaultProps);
    const {
        onChangePiece,
        value,
        ...other
    } = props;

    const [piece, setPiece] = useState(value);

    const handleChange = (event: SelectChangeEvent<string>) => {
        setPiece(event.target.value);
        onChangePiece && onChangePiece(event.target.value);
    };

    return (
        <Select
            {...other}
            value={piece}
            onChange={handleChange}
        >
            {piecesData.pieceFaces.map((piece) => {
                return (<MenuItem key={piece.code} value={piece.code}>{piece.name}</MenuItem>);
            })}
        </Select>
    );
};

export default PieceSelector;
