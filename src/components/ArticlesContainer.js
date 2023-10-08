import imageApi from "../apis/ImageApi";
import "../css/ArticlesContainer.css";
import {useLayoutEffect, useState} from "react";

function useContainerWidth() {
    const [width, setWidth] = useState(window.innerWidth - 60);
    useLayoutEffect(() => {
        function updateWidth() {
            let containerElement = document.getElementById("ArticlesContainer");
            if (!containerElement) return;
            setWidth(containerElement.offsetWidth);
        }

        document.addEventListener('load', updateWidth);
        window.addEventListener('resize', updateWidth);
        return () => window.removeEventListener('resize', updateWidth);
    }, []);
    return width;
}


function ArticlesContainer({articles, oneRowMode = false}) {

    const containerWidth = useContainerWidth();

    let articlesToRender = articles;

    let justifyContent = "space-between";
    if(oneRowMode) {
        const CARD_WIDTH_PX = 500;
        const MIN_GAP_PX = 20;
        const MAX_AMOUNT_OF_CARDS = Math.floor((containerWidth + MIN_GAP_PX) / (CARD_WIDTH_PX + MIN_GAP_PX));
        const MAX_GAP_PX = 50;
        const CURRENT_GAP_PX = (containerWidth - MAX_AMOUNT_OF_CARDS * CARD_WIDTH_PX) / (MAX_AMOUNT_OF_CARDS - 1);
        articlesToRender = articles.slice(0, MAX_AMOUNT_OF_CARDS);

        if(CURRENT_GAP_PX > MAX_GAP_PX) justifyContent = "flex-start";
    }

    return (
        <div className="ArticlesContainer" id="ArticlesContainer" style={{justifyContent}}>
            {articlesToRender.map(article => {
                const imageUrl = article["preview"] !== null ?
                    imageApi.getImageUrlByImageId(article["preview"]["id"]) :
                    "/ui/placeholders/article-placeholder.png";

                return (
                    <a key={"article-" + article["id"]}
                       href={"/article/" + article["id"]}
                       className="article">
                        <div className="img-container">
                            <img src={imageUrl} alt="article"/>
                        </div>
                        <div className="article-name">{article["name"]}</div>
                        <div className="article-created-at">
                            written on {article["createdAtPresentation"].substring(0, 10)}
                        </div>
                        <div className="article-author">by {article["author"]}</div>
                    </a>
                );
            })}
        </div>
    );
}

export default ArticlesContainer;