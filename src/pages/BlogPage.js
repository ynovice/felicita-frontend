import withHeaderAndFooter from "../hoc/withHeaderAndFooter";
import "../css/BlogPage.css";
import {useContext, useEffect, useState} from "react";
import Api from "../Api";
import FailedRequestException from "../exception/FailedRequestException";
import ErrorPage from "./ErrorPage";
import {ApiContext} from "../contexts/ApiContext";

function BlogPage() {

    const ArticlesState = {
        LOADED: "LOADED",
        LOADING: "LOADING",
        ERROR: "ERROR"
    };

    const [articles, setArticles] = useState([]);
    const [articlesState, setArticlesState] = useState(ArticlesState.LOADING);

    useEffect(() => {

        const abortController = new AbortController();

        Api.getAllArticles(abortController.signal)
            .then(retrievedArticles => {
                setArticles(retrievedArticles);
                setArticlesState(ArticlesState.LOADED)
            })
            .catch(e => {
                if (!(e instanceof FailedRequestException)) setArticlesState(ArticlesState.ERROR);
            });

        return () => abortController.abort();
    }, [ArticlesState.ERROR, ArticlesState.LOADED, ArticlesState.NOT_AUTHORIZED]);

    const { imageApi } = useContext(ApiContext);

    if(articlesState === ArticlesState.LOADING) return;

    else if (articlesState === ArticlesState.ERROR)
        return <ErrorPage errorMessage="При загрузке списка статей произошла ошибка."/>

    return (
        <div className="BlogPage">

            <div className="page-title">Блог</div>

            {articles.length === 0 &&
                <div className="page-title">В блог ещё не добавлена ни одна статья</div>
            }

            {articles.length > 0 &&
                <div className="articles-list">
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
            }
        </div>
    );

}

export default withHeaderAndFooter(BlogPage);