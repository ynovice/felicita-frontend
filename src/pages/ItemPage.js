import "../css/ItemPage.css";
import withHeaderAndFooter from "../hoc/withHeaderAndFooter";
import React, {useContext, useEffect, useState} from "react";
import Api from "../Api";
import {useParams} from "react-router-dom";
import NotFoundException from "../exception/NotFoundException";
import ErrorPage from "./ErrorPage";
import CartWidget from "../components/CartWidget";
import {AppContext, ServerState} from "../contexts/AppContext";
import RequestAbortedException from "../exception/RequestAbortedException";
import Pagination from "../components/Pagintation";
import itemApi from "../apis/ItemApi";


function ItemPage() {

    const appContext = useContext(AppContext);

    const { id: itemId } = useParams();

    const ItemState = {
        LOADING: "LOADING",
        PRESENT: "PRESENT",
        EMPTY: "EMPTY"
    }

    const [item, setItem] = useState(null);
    const [itemState, setItemState] = useState(ItemState.LOADING);

    useEffect(() => {

        const abortController = new AbortController();

        if(appContext.serverState !== ServerState.AVAILABLE) return;

        itemApi.getById(itemId, abortController.signal)
            .then(retrievedItem => {
                setItem(retrievedItem);
                setItemState(ItemState.PRESENT);
            }).catch(e => {
                if(e instanceof RequestAbortedException) return null;
                if(e instanceof NotFoundException) {
                    setItem(null);
                    setItemState(ItemState.EMPTY);
                }
            });

        return () => abortController.abort();
    }, [ItemState.EMPTY, ItemState.PRESENT, appContext.serverState, itemApi, itemId])

    const [displayedImageIndex, setDisplayedImageIndex] = useState(0);
    const getImageIdByIndex = i => item["images"][i]["id"];

    const [chosenSizeIndex, setChosenSizeIndex] = useState(0);
    const getSizeByIndex = i => item["sizesQuantities"][i]["size"];
    const getQuantityBySizeIndex = i => item["sizesQuantities"][i]["quantity"];

    const [similarItemsPage, setSimilarItemsPage] = useState([]);

    useEffect(() => {

        const abortController = new AbortController();

        itemApi.findByParams({}, abortController.signal)
            .then(itemsPage => {
                for (let i = 0; i < itemsPage["items"].length; i++) {
                    if(itemsPage["items"][i]["id"] === Number(itemId)) {
                        itemsPage["items"].splice(i, 1);
                        break;
                    }
                }
                setSimilarItemsPage(itemsPage);
            });

        return () => abortController.abort();
    }, [itemId]);

    const deleteCurrentItem = () => {

        itemApi.deleteById(itemId)
            .then(() => window.location.href = "/catalog")
            .catch(() => alert("Что-то пошло не так при удалении товара"));
    }

    if(appContext.serverState === ServerState.UNDEFINED) {
        return null;
    }

    if(appContext.serverState === ServerState.UNAVAILABLE) {
        return <ErrorPage errorMessage="Не можем показать подробности о товаре - сервер недоступен."/>
    }

    if(itemState === ItemState.LOADING) {
        return null;
    }

    if(itemState === ItemState.EMPTY) {
        return <ErrorPage errorMessage={"Товар с id " + itemId + " не найден."}/>;
    }

    return (
        <div className="ItemPage">

            <div className="item-images">
                <div className="image-container">
                    {item["images"].length > 0 ?
                        <img src={Api.getImageUrlByImageId(getImageIdByIndex(displayedImageIndex))}
                             alt="Фотография товара"/> :
                        <img src="/ui/placeholders/item-placeholder.png" alt="У товара нет фотографий"/>
                    }

                </div>



                {item["images"].length > 1 &&
                    <Pagination currentPage={displayedImageIndex}
                                totalPages={item["images"].length}
                                switchToPage={setDisplayedImageIndex}/>
                }

                <div className="admin-controls">
                    <a href={`/admin/item/save?id=${itemId}`} className="link">Редактировать</a>
                    <span className="link danger" onClick={() => deleteCurrentItem()}>Удалить</span>
                </div>
            </div>

            <div className="item-info">
                <div className="name-description-section">
                    <h1 className="item-name">{item["name"]}</h1>
                    {item["description"].length > 0 && <p className="item-description">{item["description"]}</p>}
                </div>

                <div className="item-properties">
                    <div className="regular-properties">
                        {item["categories"].length > 0 &&
                            <div className="property">
                                <div className="name">Категории</div>
                                <div className="values">
                                    {item["categories"].map((category, index) => {
                                        return (
                                            <React.Fragment key={category["id"]}>
                                                <a href={"/catalog?categoriesIds=" + category["id"]}
                                                   className="link">{category["name"]}</a>
                                                {index !== item["categories"].length - 1 && ", "}
                                            </React.Fragment>
                                        );
                                    })}
                                </div>
                            </div>
                        }
                        {item["materials"].length > 0 &&
                            <div className="property">
                                <div className="name">Материалы</div>
                                <div className="values">
                                    {item["materials"].map((material, index) => {
                                        return (
                                            <React.Fragment key={material["id"]}>
                                                <a href={"/catalog?materialsIds=" + material["id"]}
                                                   className="link">{material["name"]}</a>
                                                {index !== item["materials"].length - 1 && ", "}
                                            </React.Fragment>
                                        );
                                    })}
                                </div>
                            </div>
                        }
                        {item["colors"].length > 0 &&
                            <div className="property">
                                <div className="name">Цвета</div>
                                <div className="values">
                                    {item["colors"].map((color, index) => {
                                        return (
                                            <React.Fragment key={color["id"]}>
                                                <a href={"/catalog?colorsIds=" + color["id"]}
                                                   className="link">{color["name"]}</a>
                                                {index !== item["colors"].length - 1 && ", "}
                                            </React.Fragment>
                                        );
                                    })}
                                </div>
                            </div>
                        }
                        <div className="property">
                            <div className="name">Принт</div>
                            <div className="values">
                                <a href={"/catalog?hasPrint=" + item["hasPrint"]}
                                   className="link">{item["hasPrint"] ? "Да" : "Нет"}</a>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="property">
                            <div className="name">Цена</div>
                            <div className="price-value">{item["price"] + "₽"}</div>
                        </div>

                        {item["sizesQuantities"].length > 0 &&
                            <div className="property">
                                <div className="name">Размер</div>
                                <div className="size-values">
                                    <div className="chosen-size">{getSizeByIndex(chosenSizeIndex)["name"]}</div>
                                    {item["sizesQuantities"].length > 1 &&
                                        <div className="other-sizes">
                                            <span>Другие:</span>
                                            {item["sizesQuantities"].map((sq, i) => {
                                                return i !== chosenSizeIndex &&
                                                    <span key={sq["size"]["id"]}
                                                          className="link"
                                                          onClick={() => setChosenSizeIndex(i)}>
                                                    {sq["size"]["name"]}
                                                </span>
                                            })}
                                        </div>
                                    }
                                </div>
                            </div>
                        }
                    </div>
                </div>

                {item["id"] && item["sizesQuantities"].length > 0 ?
                    <CartWidget item={item}
                                chosenSizeId={getSizeByIndex(chosenSizeIndex)["id"]}
                                maxQuantity={getQuantityBySizeIndex(chosenSizeIndex)}/> :
                    <CartWidget item={item} chosenSizeId={null} maxQuantity={0}/>
                }

                {similarItemsPage["items"] && similarItemsPage["items"].length > 0 &&
                    <div className="similar-items">
                        <div className="section-title">Похожие товары: </div>

                        <div className="similar-items-catalog">
                            {similarItemsPage["items"].map(similarItem => {

                                const imageUrl = similarItem["images"].length > 0 ?
                                    Api.getImageUrlByImageId(similarItem["images"][0]["id"]) :
                                    "/ui/item-placeholder.png";

                                return (
                                    <div key={similarItem["id"]} className="item">
                                        <a href={"/item/" + similarItem["id"]}>
                                            <div className="image-container">
                                                <img src={imageUrl} alt={similarItem["name"]}/>
                                            </div>
                                            <p className="item-name">{similarItem["name"]}</p>
                                            <p className="item-price">{similarItem["price"]}₽</p>
                                        </a>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                }
            </div>

        </div>
    )
}

export default withHeaderAndFooter(ItemPage);