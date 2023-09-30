import "../css/CartWidget.css";
import {useCallback, useContext, useEffect, useState} from "react";
import {UpdatedUserContext, UserPresenceState} from "../contexts/UserContext";
import {AppContext, ServerState} from "../contexts/AppContext";
import Api from "../Api";
import Button from "./Button";

function CartWidget({item, chosenSizeId, maxQuantity=0}) {

    const appContext = useContext(AppContext);
    const userContext = useContext(UpdatedUserContext);

    const CartEntryState = {
        LOADING: "LOADING",
        PRESENT: "PRESENT",
        EMPTY: "EMPTY"
    }

    const [cartEntry, setCartEntry] = useState(null);
    const [cartEntryState, setCartEntryState] = useState(CartEntryState.LOADING);

    const getCartEntryByItem = useCallback((cart) => {

        for (let i = 0; i < cart["entries"].length; i++) {
            if(cart["entries"][i]["itemId"] === item["id"]) {
                return cart["entries"][i];
            }
        }
    }, [item]);

    useEffect(() => {

        if(appContext.serverState !== ServerState.AVAILABLE
            || userContext.userPresenceState !== UserPresenceState.PRESENT) {
            return;
        }

        const abortController = new AbortController();

        Api.getCart(abortController.signal)
            .then(retrievedCart => {
                setCartEntry(getCartEntryByItem(retrievedCart));
                setCartEntryState(CartEntryState.PRESENT);
            });

        return () => abortController.abort();
    }, [appContext, userContext, item, CartEntryState.PRESENT, CartEntryState.EMPTY, getCartEntryByItem]);

    const handleAddItemToCartClick = () => {

        Api.incrementItemQuantityInCart(item["id"], chosenSizeId)
            .then(updatedCart => {
                setCartEntry(getCartEntryByItem(updatedCart));
                setCartEntryState(CartEntryState.PRESENT);
            });
    }

    const handleIncrementItemQuantityInCartClick = () => {

        if(getQuantityByChosenSizeId() + 1 > maxQuantity) {
            return;
        }

        Api.incrementItemQuantityInCart(item["id"], chosenSizeId)
            .then(updatedCart => {
                setCartEntry(getCartEntryByItem(updatedCart));
                setCartEntryState(CartEntryState.PRESENT);
            });
    }

    const handleDecrementItemQuantityInCartClick = () => {

        Api.removeOneItemFromCartBySize(item["id"], chosenSizeId)
            .then(updatedCart => {
                setCartEntry(getCartEntryByItem(updatedCart));
                setCartEntryState(CartEntryState.PRESENT);
            });
    }

    const handleRemoveSizeQuantityFromCartEntryClick = () => {

        Api.removeAllItemsFromCartBySize(item["id"], chosenSizeId)
            .then(updatedCart => {
                setCartEntry(getCartEntryByItem(updatedCart));
                setCartEntryState(CartEntryState.PRESENT);
            });
    }

    const getQuantityByChosenSizeId = () => {

        if(!cartEntry || !cartEntry["sizesQuantities"])
            return 0;

        for (let i = 0; i < cartEntry["sizesQuantities"].length; i++) {
            if(cartEntry["sizesQuantities"][i]["size"]["id"] === chosenSizeId)
                return cartEntry["sizesQuantities"][i]["quantity"];
        }

        return 0;
    }

    if(appContext.serverState === ServerState.UNDEFINED
        || userContext.userPresenceState === UserPresenceState.LOADING) {
        return null;
    }

    if(appContext.serverState === ServerState.UNAVAILABLE) {
        return <div className="CartWidget">На сервере произошла ошибка при загрузке корзины :(</div>;
    }

    if(maxQuantity === 0) {
        return <div className="CartWidget">Этого товара нет в наличии.</div>;
    }

    if(userContext.userPresenceState === UserPresenceState.EMPTY) {
        return <div className="CartWidget">Войдите в аккаунт, чтобы пользоваться корзиной</div>;
    }

    if(cartEntryState === CartEntryState.LOADING) {
        return null;
    }

    if(cartEntryState === CartEntryState.EMPTY || getQuantityByChosenSizeId() === 0) {
        return (
            <div className="CartWidget">
                <span></span>
                <Button value={"В корзину"} onClick={() => handleAddItemToCartClick()}/>
            </div>
        );
    }

    return (
        <div className="CartWidget">
            <div className="title">В корзине</div>
            <div className="controls">
                <div className="inverter">
                    <div className="cart-quantity-counter">
                        <div className="counter-controls">
                            <span className="noselect"
                                  onClick={() => handleDecrementItemQuantityInCartClick()}>-</span>
                            <span className="noselect disabled">{getQuantityByChosenSizeId()}</span>
                            <span className={"noselect" + (getQuantityByChosenSizeId() === maxQuantity ? " disabled" : "")}
                                  onClick={() => handleIncrementItemQuantityInCartClick()}>
                                +
                            </span>
                        </div>
                        <div className="total-price">
                            {item["price"] * getQuantityByChosenSizeId()}₽
                        </div>
                    </div>
                    {getQuantityByChosenSizeId() === maxQuantity && <p>Больше не добавить</p>}
                </div>
                <span className="link danger" onClick={() => handleRemoveSizeQuantityFromCartEntryClick()}>Убрать</span>
            </div>

        </div>
    );
}

export default CartWidget;