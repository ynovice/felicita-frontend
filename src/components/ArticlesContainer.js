import imageApi from "../apis/ImageApi";
import "../css/ArticlesContainer.css";

function ArticlesContainer({articles}) {

    return (
        <div className="ArticlesContainer">
            {articles.map(article => {
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
                        <div className="article-info">
                            <div className="article-name">{article["name"]}</div>
                            <div className="article-createdAt">
                                {article["createdAtPresentation"].substring(0, 10)}
                            </div>
                        </div>
                    </a>
                );
            })}
        </div>
    );
}

export default ArticlesContainer;