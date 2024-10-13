import React, {useCallback} from 'react';
import clsx from "clsx";
import * as Colors from "../../../chess/types/Colors";
import {Black, White} from "../../../chess/Color";

type Props = {
    activeKey: string;
    uid: string|undefined;
    ply: number;
    moveKey: string;
    color: Colors.BW;
    san: string;
    nags?: string[];
    comment?: string;
    classes?: any;
    hasComments?: boolean;
    onMoveClick?: (e: React.MouseEvent<HTMLSpanElement>) => void;
};

const MoveListItem: React.FC<Props> = (props) => {
    const {
        activeKey, 
        uid, 
        ply, 
        moveKey, 
        color, 
        san, 
        nags, 
        comment, 
        classes,
        hasComments,
        onMoveClick
    } = props;

    const renderMoveNo = useCallback(() => {
        if (color === White) {
            const moveNo = ((ply + 1) >> 1);
            return (
                <span className="moveno" data-moveno={moveNo} key={"mn" + moveNo.toString() }>{moveNo}.</span>
            );
        }

        return (<></>);
    }, [color, ply]);

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

        const moveClasses = clsx('move', myclass, classes);

        result.push(
            <span
                id={uid}
                className={moveClasses}
                data-ply={ply}
                data-key={moveKey}
                key={moveKey}
                onClick={onMoveClick}>{san}</span>
        );

        if (nags && nags.length) {
            for (let i = 0; i < nags.length; i++) {
                const nagKey = `ng_${i}_${moveKey}`;
                result.push(
                    <span key={nagKey} className="nag">{nags[i]}</span>
                );
            }
        }

        if (comment && hasComments) {
            const evalKey = `cm_${moveKey}`;
            result.push(
                <span key={evalKey} className="comment">{comment}</span>
            );
        }

        return result;
    }, [activeKey, classes, color, comment, hasComments, moveKey, nags, onMoveClick, ply, renderMoveNo, san, uid]);
    
    return renderMove();
};

export default MoveListItem;