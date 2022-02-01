import React from 'react';
import Scrollbar from "react-scrollbars-custom";
import { _ } from '../i18n/i18n';
import { INote } from './Interfaces';

export interface NotesProps {
    notes: INote[];
    gameid?: number;
}

export class Notes extends React.Component<NotesProps, {}> {
    /**
     * constructor
     */
    constructor(props: NotesProps) {
        super(props);
    }

    private renderToolbar = () => {
        return (
            <div className="toolbar clearfix">
                <ul className="pull-right ">
                    <li><a href="#" className="delete-note-link"><i className="pg-icon">trash_alt</i></a></li>
                    <li><a href="#" className="new-note-link" data-navigate="view" data-view-port="#note-views" data-view-animation="push"><i className="pg-icon">add</i></a></li>
                </ul>
                <button aria-label="" className="btn-remove-notes btn btn-xs btn-block hide"><i className="pg-icon">close</i>Delete</button>
            </div>
        );
    };

    private renderPreviews = () => {
        
    };

    render() {
        return (
            <div className="view-port clearfix quickview-notes" id="note-views">
                <div className="view list" id="quick-note-list">
                    {this.renderToolbar()}
                    <ul>
                        <li data-noteid="1" className="d-flex justify-space-between">
                            <div className="left">
                                <div className="form-check warning no-margin">
                                    <input id="qncheckbox1" type="checkbox" value="1" />
                                    <label htmlFor="qncheckbox1"></label>
                                </div>
                                <p className="note-preview">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam</p>
                            </div>
                            <div className="d-flex right justify-content-end">
                                <span className="date">12/12/20</span>
                                <a href="#" className="d-flex align-items-center" data-navigate="view" data-view-port="#note-views" data-view-animation="push">
                                    <i className="pg-icon">chevron_right</i>
                                </a>
                            </div>
                        </li>
                        <li data-noteid="2" className="d-flex justify-space-between">
                            <div className="left">
                                <div className="form-check warning no-margin">
                                    <input id="qncheckbox2" type="checkbox" value="1" />
                                    <label htmlFor="qncheckbox2"></label>
                                </div>
                                <p className="note-preview">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam</p>
                            </div>
                            <div className="d-flex right justify-content-end">
                                <span className="date">12/12/20</span>
                                <a href="#" className="d-flex align-items-center" data-navigate="view" data-view-port="#note-views" data-view-animation="push"><i className="pg-icon">chevron_right</i></a>
                            </div>
                        </li>
                        <li data-noteid="2" className="d-flex justify-space-between">
                            <div className="left">
                                <div className="form-check warning no-margin">
                                    <input id="qncheckbox3" type="checkbox" value="1" />
                                    <label htmlFor="qncheckbox3"></label>
                                </div>
                                <p className="note-preview">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam</p>
                            </div>
                            <div className="d-flex right justify-content-end">
                                <span className="date">12/12/20</span>
                                <a href="#" className="d-flex align-items-center" data-navigate="view" data-view-port="#note-views" data-view-animation="push"><i className="pg-icon">chevron_right</i></a>
                            </div>
                        </li>
                        <li data-noteid="3" className="d-flex justify-space-between">
                            <div className="left">
                                <div className="form-check warning no-margin">
                                    <input id="qncheckbox4" type="checkbox" value="1" />
                                    <label htmlFor="qncheckbox4"></label>
                                </div>
                                <p className="note-preview">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam</p>
                            </div>
                            <div className="d-flex right justify-content-end">
                                <span className="date">12/12/20</span>
                                <a href="#" className="d-flex align-items-center" data-navigate="view" data-view-port="#note-views" data-view-animation="push"><i className="pg-icon">chevron_right</i></a>
                            </div>
                        </li>
                        <li data-noteid="4" className="d-flex justify-space-between">
                            <div className="left">
                                <div className="form-check warning no-margin">
                                    <input id="qncheckbox5" type="checkbox" value="1" />
                                    <label htmlFor="qncheckbox5"></label>
                                </div>
                                <p className="note-preview">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam</p>
                            </div>
                            <div className="d-flex right justify-content-end">
                                <span className="date">12/12/20</span>
                                <a href="#" className="d-flex align-items-center" data-navigate="view" data-view-port="#note-views" data-view-animation="push"><i className="pg-icon">chevron_right</i></a>
                            </div>
                        </li>
                    </ul>
                </div>
                <div className="view note" id="quick-note">
                    <div>
                        <ul className="toolbar">
                            <li><a href="#" className="close-note-link"><i className="pg-icon">chevron_left</i></a></li>
                            <li><a href="#" data-action="Bold" className="fs-12"><i className="pg-icon">format_bold</i></a></li>
                            <li><a href="#" data-action="Italic" className="fs-12"><i className="pg-icon">format_italics</i></a></li>
                            <li><a href="#" className="fs-12"><i className="pg-icon">link</i></a></li>
                        </ul>
                        <div className="body">
                            <div>
                                <div className="top">
                                    <span>21st april 2020 2:13am</span>
                                </div>
                                <div className="content">
                                    <div className="quick-note-editor full-width full-height js-input" contentEditable="true"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}