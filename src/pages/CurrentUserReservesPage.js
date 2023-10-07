import withHeaderAndFooter from "../hoc/withHeaderAndFooter";
import requiresUser from "../hoc/requiresUser";
import "../css/CurrentUserReservesPage.css";
import {useEffect, useMemo, useState} from "react";
import ErrorPage from "./ErrorPage";
import RequestAbortedException from "../exception/RequestAbortedException";
import ReservesList from "../components/ReservesList";
import {useSearchParams} from "react-router-dom";
import reserveApi from "../apis/ReserveApi";
import Pagination from "../components/Pagintation";

function CurrentUserReservesPage() {

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

        reserveApi.getReservesPageForCurrentUser(pageNumber, abortController.signal)
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
        <div className="CurrentUserReservesPage">

            <div className="page-title">Список зарезервированных вами товаров:</div>

            <div className="list-container">
                <ReservesList reserves={reservesPage["reserves"]}/>
                <br/>
                {reservesPage["paginationMeta"]["totalPages"] > 0 &&
                    <Pagination currentPage={pageNumber}
                                totalPages={reservesPage["paginationMeta"]["totalPages"]}
                                switchToPage={redirectToPage}
                                title="Страница:"/>
                }

            </div>



        </div>
    );
}

export default withHeaderAndFooter(requiresUser(
    CurrentUserReservesPage,
    "Войдите в аккаунт, чтобы просмотреть зарезервированные вами товары."
));