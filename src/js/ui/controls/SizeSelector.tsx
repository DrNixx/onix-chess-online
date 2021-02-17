import * as React from 'react';
import toSafeInteger from 'lodash/toSafeInteger';
import { FormControl, FormControlProps } from 'react-bootstrap';
import { BoardSize } from 'onix-board-assets';

const boardsData = require('onix-board-assets/dist/js/boards.json');

export interface SizeSelectorProps extends FormControlProps {
    defaultValue?: BoardSize;
    onChangeSize?: (size: BoardSize) => void;
    name?: string;
}

export class SizeSelector extends React.Component<SizeSelectorProps, {}> {
    public static defaultProps: SizeSelectorProps = {
        defaultValue: BoardSize.Normal,
        size: 'sm',
    }

    /**
     * constructor
     */
    constructor(props: SizeSelectorProps) {
        super(props);
    }

    private onChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { onChangeSize } = this.props;
        const size: BoardSize = toSafeInteger(e.target.value); 

        if (onChangeSize) {
            onChangeSize(size);
        }
    };

    private getSizes = (): any[] => {
        const result: any[] = [];
        boardsData.boardSizes.forEach((element: any) => {
            result.push(<option key={element.code} value={element.idx}>{element.name}</option>);
        });

        return result;
    };

    render() {
        const { defaultValue, onChangeSize, size, ...otherProps } = this.props;

        return (
            <FormControl as="select" size={size} onChange={this.onChange} defaultValue={defaultValue!.toString()} {...otherProps}>
                { this.getSizes() }
            </FormControl>
        );
    }
}