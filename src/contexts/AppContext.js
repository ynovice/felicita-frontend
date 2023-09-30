import React from "react";

export const AccessLevel = {
    UNDEFINED: "UNDEFINED",
    GUEST: "GUEST",
    AUTHENTICATED: "AUTHENTICATED",
    ADMIN: "ADMIN"
}

export const ServerState = {
    UNDEFINED: "UNDEFINED",
    AVAILABLE: "AVAILABLE",
    UNAVAILABLE: "UNAVAILABLE"
}

export const AppContext = React.createContext({
    // must contain the following fields:
    // accessLevel, setAccessLevel
    // serverState, setServerState
});

export const AppContextProvider = AppContext.Provider;