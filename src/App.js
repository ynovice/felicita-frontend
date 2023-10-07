import React, {useEffect, useState} from "react";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {UpdatedUserContextProvider, UserPresenceState} from "./contexts/UserContext";
import LoginPage from "./pages/LoginPage";
import "./css/App.css";
import MainPage from "./pages/MainPage";
import ProfilePage from "./pages/ProfilePage";
import Api from "./Api";
import FailedRequestException from "./exception/FailedRequestException";
import AdminPanelPage from "./pages/AdminPanelPage";
import SaveItemPage from "./pages/SaveItemPage";
import ItemPage from "./pages/ItemPage";
import RequestAbortedException from "./exception/RequestAbortedException";
import NotAuthorizedException from "./exception/NotAuthorizedException";
import {AccessLevel, AppContextProvider, ServerState} from "./contexts/AppContext";
import CatalogPage from "./pages/CatalogPage";
import CartPage from "./pages/CartPage";
import SaveArticlePage from "./pages/SaveArticlePage";
import ArticlePage from "./pages/ArticlePage";
import ConfirmReservePage from "./pages/ConfirmReservePage";
import ReservePage from "./pages/ReservePage";
import ReservesListPage from "./pages/CurrentUserReservesPage";
import BlogPage from "./pages/BlogPage";
import userApi from "./apis/UserApi";
import BaseApi from "./apis/BaseApi";
import {ApiContextProvider} from "./contexts/ApiContext";
import imageApi from "./apis/ImageApi";
import itemApi from "./apis/ItemApi";
import AdminReservesManagerPage from "./pages/AdminReservesManagerPage";
import reserveApi from "./apis/ReserveApi";

function App() {

    const [accessLevel, setAccessLevel] = useState(AccessLevel.UNDEFINED);
    const [serverState, setServerState] = useState(ServerState.UNDEFINED);

    const appContextValue = {
        accessLevel, setAccessLevel,
        serverState, setServerState
    };

    const [user, setUser] = useState(null);
    const [userPresenceState, setUserPresenceState] = useState(UserPresenceState.LOADING);

    const updatedUserContextValue = {
        user, setUser,
        userPresenceState, setUserPresenceState
    };

    const apiContextValue = {
        userApi, imageApi, itemApi, reserveApi
    };

    useEffect(() => {

        const abortController = new AbortController();

        Api.getCsrfData(abortController.signal)
            .then(csrfData => {
                Api.setCsrfHeaderName(csrfData["csrfHeaderName"]);
                Api.setCsrfToken(csrfData["csrfToken"]);

                BaseApi.csrfHeaderName = csrfData["csrfHeaderName"];
                BaseApi.csrfToken = csrfData["csrfToken"];

                setServerState(ServerState.AVAILABLE);

            })
            .catch(e => {
                if(e instanceof RequestAbortedException) return null;
                setServerState(ServerState.UNAVAILABLE);
            });

        return () => abortController.abort();
    }, []);

    useEffect(() => {

        const abortController = new AbortController();

        userApi
            .getCurrentUser(abortController.signal)
            .then(user => {
                setUser(user);
                setUserPresenceState(UserPresenceState.PRESENT);

                if(user["role"] === "USER") setAccessLevel(AccessLevel.AUTHENTICATED);
                else if(user["role"] === "ADMIN") setAccessLevel(AccessLevel.ADMIN);

            })
            .catch((e) => {
                if(e instanceof NotAuthorizedException) {
                    setUserPresenceState(UserPresenceState.EMPTY);
                    setAccessLevel(AccessLevel.GUEST);
                }
                else if (e instanceof FailedRequestException) setUserPresenceState(UserPresenceState.ERROR);
            })

        return () => abortController.abort();
    }, []);

    return (
        <AppContextProvider value={appContextValue}>
            <UpdatedUserContextProvider value={updatedUserContextValue}>
                <ApiContextProvider value={apiContextValue}>
                    <div className="App">
                        <BrowserRouter>
                            <Routes>
                                <Route path="/" element={<MainPage /> } />
                                <Route path="/login" element={<LoginPage /> } />
                                <Route path="/profile" element={<ProfilePage /> } />
                                <Route path="/item/:id" element={<ItemPage /> } />
                                <Route path="/catalog" element={<CatalogPage />}/>
                                <Route path="/cart" element={<CartPage />}/>
                                <Route path="/blog" element={<BlogPage />}/>
                                <Route path="/article/:id" element={<ArticlePage />}/>
                                <Route path="/reserve" element={<ReservesListPage />}/>
                                <Route path="/reserve/:id" element={<ReservePage />}/>
                                <Route path="/confirm-reserve" element={<ConfirmReservePage />}/>
                                <Route path="/admin" element={<AdminPanelPage />}/>
                                <Route path="/admin/item/save" element={<SaveItemPage />}/>
                                <Route path="/admin/article/save" element={<SaveArticlePage />}/>
                                <Route path="/admin/reserve" element={<AdminReservesManagerPage />}/>
                            </Routes>
                        </BrowserRouter>
                    </div>
                </ApiContextProvider>
            </UpdatedUserContextProvider>
     </AppContextProvider>
    );
}

export default App;
