import adminAccessOnly from "../hoc/adminAccessOnly";
import withHeaderAndFooter from "../hoc/withHeaderAndFooter";
import requiresUser from "../hoc/requiresUser";
import "../css/AdminReservesManagerPage.css";
import {useEffect, useMemo, useState} from "react";
import {useSearchParams} from "react-router-dom";
import reserveApi from "../api/ReserveApi";
import RequestAbortedException from "../exception/RequestAbortedException";
import ErrorPage from "./ErrorPage";
import ReservesList from "../components/ReservesList";
import Pagination from "../components/Pagintation";

function AdminReservesManagerPage() {

    const ReservesPageState = {
        LOADED: "LOADED",
        LOADING: "LOADING",
        ERROR: "ERROR"
    };

    const [ searchParams ] = useSearchParams();

    const [reservesPage, setReservesPage] = useState([]);
    const [reservesPageState, setReservesPageState] = useState(ReservesPageState.LOADING);

    const pageNumber = useMemo(() => {
        return searchParams.get("page") ? Number(searchParams.get("page")) : 0;
    }, [searchParams]);

    const redirectToPage = (targetPageNumber) => {
        window.location.href = window.location.href.split("?")[0] + `?page=${targetPageNumber}`;
    }

    useEffect(() => {

        if(pageNumber < 0)
            redirectToPage(0);

        const abortController = new AbortController();

        reserveApi.getReservesPageAdminScope(pageNumber, abortController.signal)
            .then(retrievedPage => {

                const { totalPages } = retrievedPage["paginationMeta"]

                if(totalPages !== 0 && pageNumber >= totalPages)
                    redirectToPage(totalPages - 1);

                setReservesPage(retrievedPage);
                setReservesPageState(ReservesPageState.LOADED);

            })
            .catch(e => {
                if(!(e instanceof RequestAbortedException)) setReservesPageState(ReservesPageState.ERROR);
            })

        return () => abortController.abort();
    }, [ReservesPageState.ERROR, ReservesPageState.LOADED, pageNumber]);

    if(reservesPageState === ReservesPageState.LOADING) return;

    else if (ReservesPageState === ReservesPageState.ERROR)
        return <ErrorPage errorMessage="При загрузке списка зарезервированных товаров произошла ошибка."/>

    return (
        <div className="AdminReservesManagerPage">
            <div className="page-title">Менеджер зарезервированных товаров</div>

            <div className="list-container">
                <ReservesList reserves={reservesPage["reserves"]} adminScope={true}/>
                <br/>
                {reservesPage["paginationMeta"]["totalPages"] > 0 &&
                    <Pagination totalPages={reservesPage["paginationMeta"]["totalPages"]}
                                currentPage={pageNumber}
                                switchToPage={redirectToPage}
                                title="Страница:"/>
                }

            </div>
        </div>
    );
}

export default withHeaderAndFooter(adminAccessOnly(requiresUser(
    AdminReservesManagerPage,
    "Чтобы просмотреть эту страницу, нужно войти в аккаунт администратора."
)));