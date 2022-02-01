import React, {useEffect, useState} from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete, {AutocompleteProps} from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import { i18n, _ } from '../../i18n/i18n';
import { FenFormat, FenString } from '../../chess/FenString';
import { IChessOpening } from '../../chess/types/Interfaces';
import { Logger } from '../../common/Logger';

type IChessOpeningWithKey = IChessOpening & {
    key?: string;
    groupName?: string;
}

type StartPosSelectorProps = Omit<AutocompleteProps<IChessOpeningWithKey, false, false, false>,
        "renderInput" | "options" | "loading" | "getOptionLabel" | "isOptionEqualToValue" | "groupBy" | "onClose" | "onOpen">  & {
    label?: React.ReactElement,
    fen?: string,
    openingsPos?: IChessOpening[],
    onChangeFen?: (fen: string) => void,
}

const StartPosSelector: React.FC<StartPosSelectorProps> = (props) => {
    const {
        label, 
        fen, 
        openingsPos, 
        onChangeFen,
        open,
        ...other
    } = props;

    const convertOpeningData = (data: IChessOpening[]): IChessOpeningWithKey[] => {
        return [...data.map(item => {
            const key = FenString.trim(item.fen!, FenFormat.castlingEp);
            return {
                ...item,
                key: key,
                groupName: _("chess-ctrls", "popular_opening")
            };
        })];
    };

    const [opened, setOpened] = React.useState(false);
    const [items, setItems] = React.useState<readonly IChessOpeningWithKey[]>(convertOpeningData(openingsPos || []));
    const isLoading = open && items.length === 0;

    React.useEffect(() => {
        i18n.register();
    }, []);

    React.useEffect(() => {
        let active = true;

        if (!isLoading) {
            return undefined;
        }

        if (process.env.NODE_ENV !== 'production') {
            fillOpeningData([]);
            return undefined;
        }

        fetch('https://www.chess-online.com/api/position/starting-positions', {mode: "cors"})
            .then(function(response) {
                if (!response.ok) {
                    throw Error(response.statusText);
                }

                return response.json();
            })
            .then(function(data: IChessOpening[]) {
                if (active) {
                    fillOpeningData(data);
                }
            })
            .catch(function(error) {
                Logger.error('Looks like there was a problem when reading openings: \n', error);
            });

        return () => {
            active = false;
        };
    }, [isLoading]);

    const fillOpeningData = (data: IChessOpening[]) => {
        const list: IChessOpeningWithKey[] = [];

        list.push({
            code: "A00.0",
            name: _("chess-ctrls", "position_label"),
            fen: "",
            key: "",
            groupName: _("chess-ctrls", "set_board")
        });

        list.push({
            code: "A00.1",
            name: _("chess-ctrls", "std_fen"),
            fen: FenString.standartStart,
            key: FenString.standartStart,
            groupName: _("chess-ctrls", "set_board")
        });

        list.push({
            code: "A00.2",
            name: _("chess-ctrls", "empty_fen"),
            fen: FenString.emptyBoard,
            key: FenString.emptyBoard,
            groupName: _("chess-ctrls", "set_board")
        });

        list.push({
            code: "A00.3",
            name: _("chess-ctrls", "get_fen"),
            fen: "---",
            key: "---",
            groupName: _("chess-ctrls", "set_board")
        });

        list.push(...convertOpeningData(data));

        setItems([...list]);
    };

    React.useEffect(() => {
        if (!open) {
            setItems([]);
        }
    }, [open]);

    const handleChange = (e: any) => {
        let fen: string = e.target.value; 

        if (fen === "---") {
            fen = window.prompt(_("chess-ctrls", "paste_fen_prompt"), "") || FenString.emptyBoard;
        }

        onChangeFen && onChangeFen(fen);
    };

    return (
        <Autocomplete
          {...other}
          open={opened}
          onOpen={() => {
            setOpened(true);
          }}
          onClose={() => {
            setOpened(false);
          }}
          groupBy={(option) => option.groupName ?? ""}
          isOptionEqualToValue={(option, value) => option.key === value.key}
          getOptionLabel={(option) => option.name ?? ""}
          options={items}
          loading={isLoading}
          renderInput={(params) => (
            <TextField
              {...params}
              label={label}
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <React.Fragment>
                    {isLoading ? <CircularProgress color="inherit" size={20} /> : null}
                    {params.InputProps.endAdornment}
                  </React.Fragment>
                ),
              }}
            />
          )}
        />
    );
};

StartPosSelector.defaultProps = {
    fen: FenString.standartStart,
    openingsPos: [],
};

export default StartPosSelector;
