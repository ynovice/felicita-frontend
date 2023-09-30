import adminAccessOnly from "../hoc/adminAccessOnly";
import requiresUser from "../hoc/requiresUser";
import withHeaderAndFooter from "../hoc/withHeaderAndFooter";
import {useContext, useEffect, useState} from "react";
import {ApiContext} from "../contexts/ApiContext";
import RequestAbortedException from "../exception/RequestAbortedException";
import ErrorPage from "./ErrorPage";
import "../css/CallbackRequestsPage.css";

function CallbackRequestsPage() {

    const { callbackRequestApi } = useContext(ApiContext);

    const CallbackRequestsState = {
        LOADED: "LOADED",
        LOADING: "LOADING",
        ERROR: "ERROR"
    }

    const [callbackRequests, setCallbackRequests] = useState([]);
    const [callbackRequestsState, setCallbackRequestsState] = useState(CallbackRequestsState.LOADING);

    useEffect(() => {

        const abortController = new AbortController();

        callbackRequestApi.getAll(abortController.signal)
            .then((retrievedRequests) => {
                setCallbackRequests(retrievedRequests);
                setCallbackRequestsState(CallbackRequestsState.LOADED);
            })
            .catch((e) => {
                if(!(e instanceof RequestAbortedException))
                    setCallbackRequestsState(CallbackRequestsState.ERROR);
            })

        return () => abortController.abort();
    }, [
        CallbackRequestsState.ERROR,
        CallbackRequestsState.LOADED,
        callbackRequestApi,
        setCallbackRequests,
        setCallbackRequestsState
    ]);

    const handleDeleteCallbackRequestById = (id) => {
        callbackRequestApi.deleteById(id)
            .then(() => window.location.reload())
            .catch(() => alert("Что-то пошло не так при попытке удалить заявку"));
    }

    if(callbackRequestsState === CallbackRequestsState.LOADING)
        return;

    if(callbackRequestsState === CallbackRequestsState.ERROR)
        return <ErrorPage errorMessage="Произошла ошибка при попытке загрузить список заявок на обратную связь"/>

    return (
        <div className="CallbackRequestsPage">

            <div className="page-title">Список заявок на обратную связь</div>

            <div className="cr-list">
                {callbackRequests.length === 0 && <p>Активных заявок не найдено</p>}
                {callbackRequests.map(cr => {
                    return (
                        <div key={"cr-" + cr["id"]} className="cr-list-item">
                            <p>{cr["name"]}</p>
                            <p>{cr["phone"]}</p>
                            <p>{cr["createdAtPresentation"]}</p>
                            <p className="link danger" onClick={() => handleDeleteCallbackRequestById(cr["id"])}>
                                Удалить
                            </p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default withHeaderAndFooter(adminAccessOnly(requiresUser(
    CallbackRequestsPage,
    "Чтобы просматривать эту страницу, вы должны обладать правами администратора."
)))