import React, {useState} from 'react';
import MenuItem from '@mui/material/MenuItem';
import Select, {SelectChangeEvent, SelectProps} from '@mui/material/Select';
import {PiecesConfig} from 'onix-board-assets';

const piecesData: PiecesConfig = require('onix-board-assets/dist/js/pieces.json');

type PieceSelectorProps =  SelectProps<string> & {
    onChangePiece?: (piece: string) => void;
}

const PieceSelector: React.FC<PieceSelectorProps> = (props) => {
    const {onChange, onChangePiece, value, ...other} = props;

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

PieceSelector.defaultProps = {
    defaultValue: 'merida',
    value: 'merida',
};

export default PieceSelector;