import "../css/ItemsCatalog.css";
import Api from "../Api";
import React from "react";

function ItemsCatalog({items, justifyContent="flex-start"}) {

    return (
        <div className="ItemsCatalog" style={{justifyContent}}>
            {items.map(item => {

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
    );

}

export default ItemsCatalog;