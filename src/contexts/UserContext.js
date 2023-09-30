import React from "react";

export const UserPresenceState = {
    LOADING: "LOADING",
    PRESENT: "PRESENT",
    EMPTY: "EMPTY",
    ERROR: "ERROR"
};

export const UpdatedUserContext = React.createContext({
    // must contain the following fields:
    // userPresenceState, setUserPresenceState
    // user, setUser
});

export const UpdatedUserContextProvider = UpdatedUserContext.Provider;