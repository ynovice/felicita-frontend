import "../css/ItemsCatalog.css";
import React, {useLayoutEffect, useState} from "react";
import imageApi from "../apis/ImageApi";

function useCatalogWidth() {
    const [width, setWidth] = useState(window.innerWidth - 60);
    useLayoutEffect(() => {
        function updateWidth() {
            let catalogElement = document.getElementById("ItemsCatalog");
            if (!catalogElement) return;
            setWidth(catalogElement.offsetWidth);
        }

        document.addEventListener('load', updateWidth);
        window.addEventListener('resize', updateWidth);
        return () => window.removeEventListener('resize', updateWidth);
    }, []);
    return width;
}

function ItemsCatalog({items, justifyContent = "flex-start"}) {

    const catalogWidth = useCatalogWidth();

    const CARD_WIDTH_PX = 200;
    const MIN_GAP_PX = 20;
    const MAX_AMOUNT_OF_CARDS = (catalogWidth + MIN_GAP_PX) / (CARD_WIDTH_PX + MIN_GAP_PX)

    const ITEMS_TO_RENDER = items.slice(0, MAX_AMOUNT_OF_CARDS)

    return (
        <div className="ItemsCatalog" id="ItemsCatalog">
            {ITEMS_TO_RENDER.map(item => {
                const imageUrl = item["images"].length > 0 ?
                    imageApi.getImageUrlByImageId(item["images"][0]["id"]) :
                    "/ui/item-placeholder.png";
                return (
                    <a key={item["id"]} className="item" href={"/item/" + item["id"]}>
                        <div className="image-container">
                            <img src={imageUrl} alt={item["name"]}/>
                        </div>
                        <p className="item-name">{item["name"]}</p>
                        <p className="item-price">{item["price"]}₽</p>
                    </a>
                );
            })}
        </div>
    );
}

export default ItemsCatalog;
