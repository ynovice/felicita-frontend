import "../css/ConfirmReservePage.css";
import withHeaderAndFooter from "../hoc/withHeaderAndFooter";
import requiresUser from "../hoc/requiresUser";
import {useEffect, useState} from "react";
import Api from "../Api";

function ConfirmReservePage() {

    const CartState = {
        LOADING: "LOADING",
        LOADED: "LOADED"
    }

    const [cart, setCart] = useState(null);
    const [cartState, setCartState] = useState(CartState.LOADING);

    useEffect(() => {

        const abortController = new AbortController();

        Api.getCart(abortController.signal)
            .then(retrievedCart => {
                setCart(retrievedCart);
                setCartState(CartState.LOADED);
            });

        return () => abortController.abort();
    }, [CartState.LOADED]);

    if(cartState === CartState.LOADING) {
        return;
    }

    if(cart["entries"].length === 0) {
        window.location.href = "/cart";
    }

    const reserveItems = () => {

        Api.reserveAllItemsInCart()
            .then(createdReserve => window.location.href = "/reserve/" + createdReserve["id"]);
    }

    return (
        <div className="ConfirmReservePage">

            <div className="page-title">Подтверждение резерва</div>

            <div className="cart-items">
                {cart["entries"].map(cartEntry => {

                    const item = cartEntry["item"];

                    const imageUrl = item["images"].length > 0 ?
                        Api.getImageUrlByImageId(item["images"][0]["id"]) :
                        "/ui/item-placeholder.png";

                    return cartEntry["sizesQuantities"].map(sq => {

                        return (
                            <div key={"cart-sq-" + sq["size"]["id"]} className="cart-item">

                                <div className="image-container">
                                    <img src={imageUrl} alt={item["name"]}/>
                                </div>

                                <div className="cart-item-info">

                                    <div className="cart-item-name">{item["name"]}</div>
                                    <div className="cart-item-size">{sq["size"]["name"]}</div>
                                    <div className="cart-item-total-price">
                                        {item["price"] * sq["quantity"]}₽
                                    </div>

                                    <div className="cart-item-controls noselect disabled">

                                        <div className="left"></div>
                                        <div className="right">

                                            <div className="counter-controls">
                                                <span className="noselect disabled">{sq["quantity"]}</span>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        );
                    });

                })}
            </div>

            <div className="cart-summary">
                <div className="items-total-count">Всего товаров: {cart["totalItems"]}</div>
                <div className="items-total-price">
                    <p>Итого</p>
                    <p>{cart["totalPrice"]}₽</p>
                </div>
                {cart["totalItems"] > 0 &&
                    <div className="button-container">
                        <input onClick={() => reserveItems()}
                               type="button"
                               className="button"
                               value="Зарезервировать"/>
                    </div>
                }
            </div>

        </div>
    );
}

export default withHeaderAndFooter(requiresUser(
    ConfirmReservePage,
    "Войдите в аккаунт, чтобы иметь возможность резервировать товары"
));