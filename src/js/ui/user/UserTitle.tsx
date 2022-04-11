import {IUser} from "../../app";
import React from "react";
import isString from "lodash/isString";

type UserTitleProps = {
    title?: IUser['title']
};
const UserTitle: React.VFC<UserTitleProps> = (props) => {
    if (props.title) {
        if (isString(props.title)) {
            return (
                <span className="label label-success text-uppercase fs-10 lh-20 me-1"
                      data-toggle="tooltip"
                      title="">{props.title}</span>
            );
        } else {
            return (
                <span className="label label-success text-uppercase fs-10 lh-20 me-1"
                      data-toggle="tooltip"
                      title={props.title.name}>{props.title.id}</span>
            );
        }
    }

    return null;
};

export default UserTitle;