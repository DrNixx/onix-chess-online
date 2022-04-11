import React, {useEffect, useState} from "react";
import {IUser} from "../../app";
import {IChessPerfs, PerfNameType} from "../../chess/types/Interfaces";
import toSafeInteger from "lodash/toSafeInteger";
import {appInstance} from "../../app/IApplication";
import {Logger} from "../../common/Logger";
import prefsCache from "../../app/prefsCache";

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

const UserRatings: React.VFC<Props> = (props) => {

    const { user } = props;

    const [prefs, setPrefs] = useState<IChessPerfs>({});
    const ratingOrder: PerfNameType[] = ["main", "maina", "chess960", "classic", "classica", "exotic"];
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!loading && user?.id) {
            const uid = toSafeInteger(user?.id);
            let cachedPrefs = prefsCache.get(uid);
            if (cachedPrefs) {
                setPrefs(cachedPrefs);
            } else {
                if (appInstance) {
                    setLoading(true);
                    fetch(appInstance.getApiUrl(`/user/prefs/${uid}`), {mode: "cors"})
                        .then((response) => {
                            if (!response.ok) {
                                throw Error(response.statusText);
                            }
                            // Read the response as json.
                            return response.json();
                        })
                        .then((prefsData) => {
                            if (prefsData) {
                                setLoading(false);
                                setPrefs(prefsData);
                                prefsCache.set(uid, prefsData);
                            }
                        })
                        .catch(function(error) {
                            Logger.error('Looks like there was a problem when reading user data: \n', error);
                        });
                }
            }
        }
    }, [user]);

    return (
        <div className="row no-gutters">
            {ratingOrder.map(o => {
                return (
                    <>
                        {prefs[o] &&
                        <div className="col-4">
                            <span className="lh-lg" data-toggle="tooltip" title="">
                                {iconMap[o]}
                                <span className="bold small">{prefs[o]?.rating}</span>
                            </span>
                        </div>}
                    </>
                )
            })}
        </div>
    );
};

UserRatings.defaultProps = {
};

export default UserRatings;