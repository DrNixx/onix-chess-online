import React from 'react';
import Scrollbar from "react-scrollbars-custom";
import { FormGroup, Row, Col, FormLabel } from 'react-bootstrap';
import { notify } from 'pages-ts';
import { _ } from '../../i18n/i18n';
import { copy } from '../CopyToClipboard';
import TextWithCopy from '../controls/TextWithCopy';


export interface GamePgnProps {
    fen: string,
    pgn?: string
}

export class GamePgn extends React.Component<GamePgnProps, {}> {
    /**
     * constructor
     */
    constructor(props: GamePgnProps) {
        super(props);
    }

    render() {
        const { fen, pgn } = this.props;

        const copyPgn = (e: React.MouseEvent<HTMLPreElement>) => {
            if (copy(pgn)) {
                notify({
                    message: _("core", "copied"),
                    position: "bottom-right",
                    style: 'simple' 
                });
            }
        };

        return (
            <React.Fragment>
                <Row>
                    <Col md={12}>
                        <FormGroup>
                            <FormLabel>{_("chess", "fen")}</FormLabel>
                            <TextWithCopy value={fen} placeholder={_("chess", "fen")} />
                        </FormGroup>
                    </Col>
                </Row>
                <Row>
                    <Col md={12}>
                        <div className="pgn-text">
                            <Scrollbar trackYProps={{style: {width: 5}}}>
                                <pre onClick={copyPgn} className="py-0 pl-0">{pgn}</pre>
                            </Scrollbar>
                        </div>
                    </Col>
                </Row>
            </React.Fragment>
        );
    }
}