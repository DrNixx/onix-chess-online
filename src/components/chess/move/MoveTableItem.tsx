import React, {useCallback} from 'react';
import clsx from "clsx";
import * as Colors from "../../../chess/types/Colors";
import {Black, White} from "../../../chess/Color";
import {nanoid} from "nanoid";
import {EvalItem} from "../../../chess/EvalItem";

type Props = {
    activeKey?: string;
    uid?: string|undefined;
    ply: number;
    moveKey?: string;
    color: Colors.BW;
    san?: string;
    nags?: string[];
    comment?: string;
    evalItem?: EvalItem;
    classes?: any;
    hasComments?: boolean;
    onMoveClick?: (e: React.MouseEvent<HTMLSpanElement>) => void;
};

const MoveTableItem: React.FC<Props> = (props) => {
    const {
        activeKey,
        uid,
        ply,
        moveKey,
        color,
        san,
        nags,
        evalItem,
        classes,
        hasComments,
        onMoveClick
    } = props;

    const renderMoveNo = useCallback(() => {
        if (color === White) {
            const moveNo = ((ply + 1) >> 1);
            return (
                <div className="moveno" data-moveno={moveNo} key={"mn" + moveNo.toString() }>{moveNo}</div>
            );
        }

        return (<></>);
    }, [color, ply])

    const renderDummy = useCallback(() => {
        const result: JSX.Element[] = [];

        if (color === White) {
            result.push(renderMoveNo());
        }

        const myclass = {
            ['white']: (color === White),
            ['black']: (color === Black)
        };

        result.push(
            <div className={clsx('move', myclass)} key={nanoid(8)}>
                <div className="san">...</div>
            </div>
        );

        return result;
    }, [color, renderMoveNo]);

    const renderMove = useCallback(() => {
        const result = [];
        if (color === White) {
            result.push(renderMoveNo());
        }

        const myclass = {
            ['white']: (color === White),
            ['black']: (color === Black),
            ['active']: (activeKey === moveKey)
        };

        const nagsElement: JSX.Element[] = [];
        const evalsElement: JSX.Element[] = [];

        if (nags && nags.length) {
            for (let i = 0; i < nags.length; i++) {
                const nagKey = `nag_${i}_${moveKey}`;
                nagsElement.push(
                    <span key={nagKey} className="nag">{nags[i]}</span>
                );
            }
        }

        if (hasComments && evalItem) {
            const evalKey = `cm_${moveKey}`;
            const sign = (evalItem.advantage > 0) ? "+" : "";
            evalsElement.push(<div className="eval" key={evalKey}>{sign}{evalItem.advantage}</div>);
        }

        const moveClasses = clsx('move', myclass, classes);

        result.push(
            <div
                id={uid}
                className={moveClasses}
                data-ply={ply}
                data-key={moveKey}
                key={moveKey}
                onClick={onMoveClick}>
                <div className="san" key={`san_${moveKey}`}>{san}</div>
                { nagsElement }
                { evalsElement }
            </div>
        );

        /*
        if (comment && state.evals) {
            const evalKey = `cm_${moveKey}`;
            result.push(
                <span key={evalKey} className="comment">{comment}</span>
            );
        }
        */

        return result;
    }, [activeKey, classes, color, evalItem, hasComments, moveKey, nags, onMoveClick, ply, renderMoveNo, san, uid]);

    return moveKey ? renderMove() : renderDummy();
};

export default MoveTableItem;