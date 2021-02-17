import * as React from 'react';

export interface PgnViewProps {
    pgn?: string,
    readOnly?: boolean,
    onChange?: (pgn: string) => void,
    onSend?: (pgn: string) => void,
}

export interface PgnViewState {
    pgn?: string
}

export class PgnView extends React.Component<PgnViewProps, PgnViewState> {
    public static defaultProps: PgnViewProps = {
        pgn: "*",
        readOnly: true,
    }

    constructor(props: PgnViewProps) {
        super(props);

        this.state = {
            pgn: props.pgn
        };
    }

    private onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const { onChange } = this.props;
        const pgn: string = e.target.value; 

        this.setState({
            ...this.state,
            pgn: pgn
        }, () => {
            if (onChange) {
                onChange(pgn);
            }
        })
    }

    render() {
        const { pgn } = this.state;

        const command = "";

        return (
            <div className="pgn-wrapper">
                <div className="pgn-text">
                    <textarea className="pgn-body" defaultValue={pgn} onChange={this.onChange} spellCheck={false}></textarea>
                </div>
                {command}  
            </div>
        );
    }
}