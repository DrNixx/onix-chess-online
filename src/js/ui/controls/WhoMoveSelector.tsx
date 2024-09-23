import React, {useState} from 'react';
import toSafeInteger from 'lodash/toSafeInteger';
import MenuItem from '@mui/material/MenuItem';
import Select, {SelectChangeEvent, BaseSelectProps} from '@mui/material/Select';
import { White, Black } from '../../chess/Color';
import {BW} from '../../chess/types/Colors';
import {useTranslation} from "react-i18next";
import {defaultOf} from "../../utils/propsUtils";
import {useDefaults} from "../../hooks/useDefaults";

type WhoMoveSelectorProps =  Omit<BaseSelectProps<BW>, 'onChange'> & {
    onChangeTurn?: (color: BW) => void;
}

type propsWithDefaults = 'defaultValue' | 'value' | 'variant';
const defaultProps: defaultOf<WhoMoveSelectorProps, propsWithDefaults> = {
    defaultValue: White,
    value: White,
    variant: 'outlined',
};

const WhoMoveSelector: React.FC<WhoMoveSelectorProps> = (propsIn) => {
    const props = useDefaults(propsIn, defaultProps);
    const {
        onChangeTurn,
        value,
        ...other
    } = props;

    const { t } = useTranslation(['chess-ctrls']);

    const [who, setWho] = useState(value);

    const handleChange = (event: SelectChangeEvent<BW>) => {
        const newWho = toSafeInteger(event.target.value) as BW;
        setWho(newWho);
        onChangeTurn && onChangeTurn(newWho);
    };

    return (
        <Select
            {...other}
            value={who}
            onChange={handleChange}
        >
            <MenuItem value={White}>{t("white_move")}</MenuItem>
            <MenuItem value={Black}>{t("black_move")}</MenuItem>
        </Select>
    );
};

export default WhoMoveSelector;