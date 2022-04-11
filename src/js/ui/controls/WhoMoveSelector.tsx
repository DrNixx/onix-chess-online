import React, {useState} from 'react';
import toSafeInteger from 'lodash/toSafeInteger';
import MenuItem from '@mui/material/MenuItem';
import Select, {SelectChangeEvent, SelectProps} from '@mui/material/Select';
import { Color } from '../../chess/Color';
import { Colors } from '../../chess/types/Types';
import {useTranslation} from "react-i18next";
import Skeleton from "@mui/material/Skeleton";

type WhoMoveSelectorProps =  SelectProps<Colors.BW> & {
    onChangeTurn?: (color: Colors.BW) => void;
}

const WhoMoveSelector: React.FC<WhoMoveSelectorProps> = (props) => {
    const {onChange, onChangeTurn, value, ...other} = props;

    const { t } = useTranslation(['chess-ctrls']);

    const [who, setWho] = useState(value);

    const handleChange = (event: SelectChangeEvent<Colors.BW>) => {
        const newWho = toSafeInteger(event.target.value) as Colors.BW;
        setWho(newWho);
        onChangeTurn && onChangeTurn(newWho);
    };

    return (
        <Select
            {...other}
            value={who}
            onChange={handleChange}
        >
            <MenuItem value={Color.White}>{t("white_move")}</MenuItem>
            <MenuItem value={Color.Black}>{t("black_move")}</MenuItem>
        </Select>
    );
};

WhoMoveSelector.defaultProps = {
    defaultValue: Color.White,
    value: Color.White,
};

export default WhoMoveSelector;