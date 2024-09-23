import React, { useCallback } from 'react';
import { MentionData } from './types';
import Chip from '@mui/material/Chip';
import Avatar from '@mui/material/Avatar';

type MentionProps = React.HTMLAttributes<HTMLSpanElement> & {
    element: MentionData;
};

const Mention: React.FC<MentionProps> = (props) => {
    const { element } = props;
    // const selected = useSelected()
    // const focused = useFocused()

    const getAvatar = useCallback(() => {
        if (element.image) {
            return <Avatar component="span" src={element.image} alt={element.character} />;
        } else {
            return <Avatar component="span">{element.avatar}</Avatar>;
        }
    }, [element]);

    const handleClick = () => {
        // NOP
    };

    return (
        <Chip
            component="span"
            sx={{
                mx: '1px',
            }}
            avatar={getAvatar()}
            label={element.character}
            onClick={handleClick}
            contentEditable={false}
            data-cy={`mention-${element.character.replace(' ', '-')}`}
            data-id={element.id}
        />
    );
};

export default Mention;
