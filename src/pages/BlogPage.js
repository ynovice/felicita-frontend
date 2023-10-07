import withHeaderAndFooter from "../hoc/withHeaderAndFooter";
import "../css/BlogPage.css";
import {useEffect, useState} from "react";
import FailedRequestException from "../exception/FailedRequestException";
import ErrorPage from "./ErrorPage";
import ArticlesContainer from "../components/ArticlesContainer";
import articleApi from "../apis/ArticleApi";

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

        articleApi.getAll(abortController.signal)
            .then(retrievedArticles => {
                setArticles(retrievedArticles);
                setArticlesState(ArticlesState.LOADED)
            })
            .catch(e => {
                if (!(e instanceof FailedRequestException)) setArticlesState(ArticlesState.ERROR);
            });

        return () => abortController.abort();
    }, [ArticlesState.ERROR, ArticlesState.LOADED, ArticlesState.NOT_AUTHORIZED]);

    if (articlesState === ArticlesState.LOADING) return;

    else if (articlesState === ArticlesState.ERROR)
        return <ErrorPage errorMessage="При загрузке списка статей произошла ошибка."/>

    return (
        <div className="BlogPage">
            <div className="page-title">Блог</div>
            {articles.length === 0 &&
                <div className="page-title">В блог ещё не добавлена ни одна статья</div>
            }
            {articles.length > 0 && <ArticlesContainer articles={articles}/>}
        </div>
    );

}

export default withHeaderAndFooter(BlogPage);