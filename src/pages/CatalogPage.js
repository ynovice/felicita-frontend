import withHeaderAndFooter from "../hoc/withHeaderAndFooter";
import "../css/CatalogPage.css";
import React, {useState} from "react";
import ItemFiltersContainer from "../components/ItemFiltersContainer";
import Api from "../Api";
import {useSearchParams} from "react-router-dom";
import Pagination from "../components/Pagintation";

function CatalogPage() {

    const [searchParams] = useSearchParams();
    if(searchParams.get("page") === null)
        searchParams.set("page", 0);

    const CatalogState = {
        LOADING: "LOADING",
        LOADED: "LOADED",
    }

    const [itemsPage, setItemsPage] = useState(null);
    const [catalogState, setCatalogState] = useState(CatalogState.LOADING);

    const switchPage = (pageNumber) => {
        searchParams.set("page", pageNumber);
        window.location.href = window.location.href.split("?")[0] + "?" + searchParams;
    }

    const [filtersOpened, setFiltersOpened] = useState(false);

    return (
        <div className="CatalogPage">

            <ItemFiltersContainer opened={filtersOpened}
                                  setOpened={setFiltersOpened}
                                  setItemsPage={setItemsPage}
                                  setCatalogState={setCatalogState}
                                  onSuccessCatalogState={CatalogState.LOADED}/>

            <div className="right-side">
                
                <div className="heading">Каталог</div>

                <input className="button toggle-filters-button"
                       type="button"
                       value="Фильтры"
                       onClick={() => setFiltersOpened(!filtersOpened)}/>
                
                {catalogState === CatalogState.LOADED && itemsPage["items"].length > 0 &&
                    <div className="catalog-items">
                        {itemsPage["items"].map(item => {

                            const imageUrl = item["images"].length > 0 ?
                                Api.getImageUrlByImageId(item["images"][0]["id"]) :
                                "/ui/item-placeholder.png";

                            return (
                                <div key={item["id"]} className="item">
                                    <a href={"/item/" + item["id"]}>
                                        <div className="image-container">
                                            <img src={imageUrl} alt={item["name"]}/>
                                        </div>
                                        <p className="item-name">{item["name"]}</p>
                                        <p className="item-price">{item["price"]}₽</p>
                                    </a>
                                </div>
                            );
                        })}
                    </div>
                }
                {catalogState === CatalogState.LOADED && itemsPage["items"].length === 0 &&
                    <div className="catalog-items">Товары по вашему запросу не найдены</div>
                }

                {itemsPage &&
                    <Pagination title="Страница:"
                                totalPages={itemsPage["paginationMeta"]["totalPages"]}
                                currentPage={searchParams.get("page") ? Number(searchParams.get("page")) : 0}
                                switchToPage={switchPage}/>
                }
            </div>
        </div>
    )
}

export default withHeaderAndFooter(CatalogPage);