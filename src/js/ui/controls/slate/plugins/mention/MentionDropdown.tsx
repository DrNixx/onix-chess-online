import React from 'react';

import List from '@mui/material/List';
import Paper from '@mui/material/Paper';
import Portal from '@mui/material/Portal';
import ListItem from '@mui/material/ListItem';
import { MentionItem } from './types';

type Props = {
    items: MentionItem[];
    top: number;
    left: number;
    selectedIndex?: number;
    onClick: (selectedIndex: number) => void;
};

const MentionDropdown: React.FC<Props> = (props) => {
    const { items, top, left, selectedIndex, onClick } = props;

    if (items.length === 0) {
        return null;
    }

    return (
        <Portal>
            <Paper sx={{ minWidth: 200, position: 'absolute', top: top, left: left }}>
                <List>
                    {items.map((item, index) => {
                        return (
                            <ListItem
                                key={index}
                                sx={{ cursor: 'pointer' }}
                                selected={index === selectedIndex}
                                onClick={() => onClick(index)}
                            >
                                {item.content}
                            </ListItem>
                        );
                    })}
                </List>
            </Paper>
        </Portal>
    );
};

export default MentionDropdown;
