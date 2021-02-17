import * as React from 'react';
import { FormControl, FormControlProps } from 'react-bootstrap';
import { i18n, _ } from '../../i18n/i18n';
import { FenFormat, FenString } from '../../chess/FenString';
import { IChessOpening } from '../../chess/types/Interfaces';

export interface StartPosSelectorProps extends FormControlProps {
    fen?: string,
    openingsPos?: IChessOpening[],
    onChangeFen?: (fen: string) => void,
    name?: string,
}

export interface StartPosSelectorState {
    openings: IChessOpening[],
}

export class StartPosSelector extends React.Component<StartPosSelectorProps, StartPosSelectorState> {
    private posMap: Map<string, string> = new Map();

    public static defaultProps: StartPosSelectorProps = {
        fen: FenString.standartStart,
        openingsPos: [],
        size: 'sm',
    }

    /**
     * constructor
     */
    constructor(props: StartPosSelectorProps) {
        super(props);

        i18n.register();

        this.setPosMap(FenString.emptyBoard);
        this.setPosMap(FenString.standartStart);
        this.state = {
            openings: props.openingsPos!,
        };
    }

    componentDidMount() {
        if (process.env.NODE_ENV === 'production') {
            const { state } = this;

            if (state.openings.length === 0) {
                const ajaxCallback = this.ajaxCallback;
                fetch('https://www.chess-online.com/api/position/starting-positions', {mode: "cors"})
                    .then(function(response) {
                        if (!response.ok) {
                            throw Error(response.statusText);
                        }
                        // Read the response as json.
                        return response.json();
                    })
                    .then(function(responseAsJson) {
                        ajaxCallback(responseAsJson);
                    })
                    .catch(function(error) {
                        console.log('Looks like there was a problem when reading openings: \n', error);
                    });
            } 
        }
    }

    private ajaxCallback = (data?: any) => {
        const { state } = this;

        let openings: IChessOpening[] = [];
        for (var i = 0; i < data.length; i++) {
            const option = data[i];
            this.setPosMap(option.fen);
            openings.push(option);
        }
        
        this.setState({
            ...state,
            openings: openings
        });
    }

    private setPosMap = (fen: string) => {
        let key = FenString.trim(fen, FenFormat.castlingEp);
        this.posMap.set(key, fen);
    };

    private onChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { onChangeFen } = this.props;
        let fen: string = e.target.value; 

        if (fen === "---") {
            fen = window.prompt(_("chess-ctrls", "paste_fen_prompt"), "") || FenString.emptyBoard;
        }

        if (onChangeFen) {
            onChangeFen(fen);
        }
    };

    private getOpenings = (openingsPos: IChessOpening[]) => {
        if (openingsPos && openingsPos.length) {
            let openings = [];
            for (let i = 0; i < openingsPos.length; i++) {
                const option = openingsPos[i];
                openings.push(
                    <option key={i+3} value={option.fen}>{option.name}</option>
                );
            }

            return (
                <optgroup label={_("chess-ctrls", "popular_opening")}>
                    {openings}
                </optgroup>
            );

        } else {
            return null;
        }
    }
    
    render() {
        let { fen, openingsPos, onChangeFen, size, ...otherProps } = this.props;
        const { openings } = this.state;
        
        const key = FenString.trim(fen!, FenFormat.castlingEp);
        let value = this.posMap.get(key);
        if (value === undefined) {
            value = "";
        }
        
        return (
            <FormControl as="select" size={size} onChange={this.onChange} value={value} {...otherProps}>
                <optgroup label={_("chess-ctrls", "set_board")}>
                    <option value="">{_("chess-ctrls", "position_label")}</option>
                    <option value={FenString.standartStart}>{_("chess-ctrls", "std_fen")}</option>
                    <option value={FenString.emptyBoard}>{_("chess-ctrls", "empty_fen")}</option>
                    <option value="---">{_("chess-ctrls", "get_fen")}</option>
                </optgroup>
                {this.getOpenings(openings)}
            </FormControl>
        );
    }
}
