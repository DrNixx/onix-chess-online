import React, {useState} from 'react';
import toSafeInteger from 'lodash/toSafeInteger';
import MenuItem from '@mui/material/MenuItem';
import Select, {SelectChangeEvent, SelectProps} from '@mui/material/Select';
import { i18n, _ } from '../../i18n/i18n';
import { Color } from '../../chess/Color';
import { Colors } from '../../chess/types/Types';

type WhoMoveSelectorProps =  SelectProps<Colors.BW> & {
    onChangeTurn?: (color: Colors.BW) => void;
}

const WhoMoveSelector: React.FC<WhoMoveSelectorProps> = (props) => {
    const {onChange, onChangeTurn, value, ...other} = props;

    const [who, setWho] = useState(value);

    const handleChange = (event: SelectChangeEvent<Colors.BW>) => {
        const newWho = toSafeInteger(event.target.value) as Colors.BW;;
        setWho(newWho);
        onChangeTurn && onChangeTurn(newWho);
    };

    return (
        <Select
            {...other}
            value={who}
            onChange={handleChange}
        >
            <MenuItem value={Color.White}>{_("chess-ctrls", "white_move")}</MenuItem>
            <MenuItem value={Color.Black}>{_("chess-ctrls", "black_move")}</MenuItem>
        </Select>
    );
};

WhoMoveSelector.defaultProps = {
    defaultValue: Color.White,
    value: Color.White,
};

export default WhoMoveSelector;