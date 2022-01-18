import React from 'react';
import toSafeInteger from 'lodash/toSafeInteger';
import { FormControl, FormControlProps } from 'react-bootstrap';
import { i18n, _ } from '../../i18n/i18n';
import { Color } from '../../chess/Color';
import { Colors } from '../../chess/types/Types';

export interface WhoMoveSelectorProps extends FormControlProps {
    defaultValue?: Colors.BW;
    onChangeTurn?: (color: Colors.BW) => void;
    name?: string;
}

export class WhoMoveSelector extends React.Component<WhoMoveSelectorProps, {}> {
    public static defaultProps: WhoMoveSelectorProps = {
        defaultValue: Color.White,
        size: "sm",
    }

    /**
     * constructor
     */
    constructor(props: WhoMoveSelectorProps) {
        super(props);
        
        i18n.register();
    }

    private onChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { onChangeTurn } = this.props;
        const color: Colors.BW = toSafeInteger(e.target.value) as Colors.BW; 

        if (onChangeTurn) {
            onChangeTurn(color);
        }
    }

    render() {
        const { defaultValue, onChangeTurn, size, ...otherProps } = this.props;
        
        return (
            <FormControl as="select" size={size} onChange={this.onChange} defaultValue={defaultValue!.toString()} {...otherProps}>
                <option value={Color.White.toString()}>{_("chess-ctrls", "white_move")}</option>
                <option value={Color.Black.toString()}>{_("chess-ctrls", "black_move")}</option>
            </FormControl>
        );
    }
}
