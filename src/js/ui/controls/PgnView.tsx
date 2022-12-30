import React, {useEffect, useState} from 'react';

type Props = {
    pgn?: string,
    readOnly?: boolean,
    onChange?: (pgn: string) => void,
    onSend?: (pgn: string) => void,
};

export interface PgnViewState {
    pgn?: string
}

const defaultProps = {
    pgn: "*",
    readOnly: true,
};

const PgnView: React.FC<Props> = (propsIn) => {
    const props = {...defaultProps, ...propsIn};
    const [pgn, setPgn] = useState(props.pgn);

    useEffect(() => {
        props.onChange && props.onChange(pgn);
    }, [pgn]);

    const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setPgn(e.target.value);
    }

    return (
        <div className="pgn-wrapper">
            <div className="pgn-text">
                <textarea className="pgn-body" defaultValue={pgn} onChange={onChange} spellCheck={false} />
            </div>
        </div>
    );
};

export default PgnView;