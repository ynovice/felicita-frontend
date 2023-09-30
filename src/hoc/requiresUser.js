import {UpdatedUserContext, UserPresenceState} from "../contexts/UserContext";
import React, {useContext} from "react";
import ErrorPage from "../pages/ErrorPage";

function requiresUser(TargetComponent, errorMessage) {

    function RequiresUserComponent () {

        const { userPresenceState } = useContext(UpdatedUserContext);

        if(userPresenceState === UserPresenceState.LOADING) return;

        if(userPresenceState === UserPresenceState.EMPTY)
            return <ErrorPage errorMessage={errorMessage}/>

        if(userPresenceState === UserPresenceState.ERROR)
            return <ErrorPage errorMessage="Произошла ошибка при аутентификации."/>

        return <TargetComponent />
    }

    return RequiresUserComponent;
}

export default requiresUser;