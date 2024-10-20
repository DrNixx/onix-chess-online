import React, {useEffect, useState} from 'react';
import toSafeInteger from 'lodash/toSafeInteger';
import {IChessPerfs, PerfNameType} from '../../chess/types/Interfaces';
import prefsCache from '../../app/prefsCache';
import {IUser} from "../../models/user/IUser";
import {apiGet} from "../../api/Api";

type Props = {
    user: IUser;
};

type IconMapType = {
    [name in PerfNameType]?: JSX.Element;
}

const iconMap: IconMapType = {
    'main': <i className="ci-pawn-half-alt fs-16 me-1"/>,
    'classic': <i className="ci-pawn-half-o fs-16 me-1"/>,
    'maina': <i className="ci-comp-pawn me-1 ci-lg"/>,
    'classica': <i className="ci-pawn-half-alt-o fs-16 me-1"/>,
    'chess960': <span className="label me-1">960</span>,
    'exotic': <span className="label me-1">Ex</span>
};

const UserRatings: React.FC<Props> = (props) => {

    const { user } = props;

    const [prefs, setPrefs] = useState<IChessPerfs>({});
    const ratingOrder: PerfNameType[] = ["main", "maina", "chess960", "classic", "classica", "exotic"];
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!loading && user?.id) {
            const uid = toSafeInteger(user?.id);
            const cachedPrefs = prefsCache.get(uid);
            if (cachedPrefs) {
                setPrefs(cachedPrefs);
            } else {
                setLoading(true);
                apiGet(`/user/prefs/${uid}`)
                    .then((prefsData) => {
                        if (prefsData) {
                            setLoading(false);
                            setPrefs(prefsData);
                            prefsCache.set(uid, prefsData);
                        }
                    })
                    .catch(function(error) {
                        console.error('Looks like there was a problem when reading user data: \n', error);
                    });
            }
        }
    }, [loading, user]);

    return (
        <div className="row no-gutters">
            {ratingOrder.map(o => {
                return (
                    <React.Fragment key={o + '-' + user.id}>
                        {prefs[o] &&
                        <div className="col-4">
                            <span className="lh-lg" data-toggle="tooltip" title="">
                                {iconMap[o]}
                                <span className="bold small">{prefs[o]?.rating}</span>
                            </span>
                        </div>}
                    </React.Fragment>
                )
            })}
        </div>
    );
};

export default UserRatings;