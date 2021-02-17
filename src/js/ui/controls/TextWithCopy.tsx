import * as React from 'react';
import { InputGroup, FormControl, FormControlProps, Button } from 'react-bootstrap';
import { copy } from '../CopyToClipboard';
import { i18n, _ } from '../../i18n/i18n';

export interface TextWithCopyProps extends FormControlProps {
    value?: string,
    placeholder?: string,
    icon?: string,
    name?: string,
}

export interface TextWithCopyState {
    className: string;
}

export class TextWithCopy extends React.Component<TextWithCopyProps, TextWithCopyState> {
    public static defaultProps: TextWithCopyProps = {
        icon: 'fa fa-copy',
    }

    /**
     * constructor
     */
    constructor(props: TextWithCopyProps) {
        super(props);

        i18n.register();
        
        this.state = { 
            className: "",
        };
    }

    private onCopy = () => {
        if (copy(this.props.value)) {
            this.setSuccess();
        }
    }

    private setSuccess = () => {
        const that = this;
        this.setState({ 
            className: 'text-success',
        }, function() {
            setTimeout(that.setPrimary, 2000);
        });
    }

    private setPrimary = () => {
        this.setState({ 
            className: "",
        });
    }

    render() {
        let { id, size, placeholder, readOnly, icon, ...elementProps } = this.props;

        return (
            <InputGroup size={size}>
                <FormControl 
                    size={size}
                    className={this.state.className} 
                    {...elementProps}
                    readOnly={true} 
                    placeholder={placeholder} />
                <InputGroup.Append>
                    <Button 
                        variant="primary" 
                        tabIndex={-1}
                        onClick={this.onCopy} 
                        title={_("chess-ctrls", "copy_to_clipboard")}><i className={icon}></i></Button>
                </InputGroup.Append>
            </InputGroup>
        );
    }
}