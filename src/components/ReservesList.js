import "../css/ReservesList.css";

function ReservesList({reserves, adminScope=false}) {

    return (
        <div className="ReservesList">
            {reserves.length === 0 &&
                <div className="page-title">У вас нет зарезервированных товаров.</div>
            }
            {reserves.map(reserve => {

                const { id, createdAtPresentation, totalPrice, owner } = reserve;

                return (
                    <div key={"rsrv-" + id} className="reserve">
                        <a href={"/reserve/" + id}>
                            <div>
                                <img src="/favicon.png" alt="favicon"/>
                                <p>Номер {id}</p>
                            </div>
                            <div>{createdAtPresentation.substring(0, 10)}</div>
                            <div className="reserve-status">активен</div>
                            {adminScope && <div className="reserve-owner">{owner["username"]} # {owner["id"]}</div>}
                            <div className="reserve-total-price">{totalPrice}₽</div>
                        </a>
                    </div>
                );
            })}
        </div>
    );
}

export default ReservesList;