import withHeaderAndFooter from "../hoc/withHeaderAndFooter";
import "../css/ArticlePage.css";
import {useEffect, useMemo, useState} from "react";
import ErrorPage from "./ErrorPage";
import {useParams} from "react-router-dom";
import Api from "../Api";
import NotFoundException from "../exception/NotFoundException";
import FailedRequestException from "../exception/FailedRequestException";
import imageApi from "../apis/ImageApi";

function ArticlePage () {

    const ArticleState = {
        LOADING: "LOADING",
        PRESENT: "PRESENT",
        NOT_FOUND: "NOT_FOUND",
        ERROR: "ERROR"
    };

    const DOMPurify = useMemo(() => require("dompurify")(window), []);

    const { id } = useParams();

    const [article, setArticle] = useState(null);
    const [articleState, setArticleState] = useState(ArticleState.LOADING);

    useEffect(() => {

        const abortController = new AbortController();

        Api.getArticleById(id, abortController.signal)
            .then(retrievedArticle => {
                setArticle(retrievedArticle);
                setArticleState(ArticleState.PRESENT)
            })
            .catch(e => {
                if(e instanceof NotFoundException) {
                    setArticleState(ArticleState.NOT_FOUND);
                } else if (!(e instanceof FailedRequestException)) {
                    setArticleState(ArticleState.ERROR);
                }
            });

        return () => abortController.abort();
    }, [ArticleState.ERROR, ArticleState.NOT_FOUND, ArticleState.PRESENT, id]);

    const handleDeleteArticleClick = () => {

        Api.deleteArticleById(article["id"])
            .then(() => {
                window.location.href = "/blog";
            })
            .catch(e => {
                console.log(e);
                alert("Проищошла ошибка при попытке удалить статью.")
            })

    }

    if(articleState === ArticleState.LOADING) {
        return;
    } else if (articleState === ArticleState.NOT_FOUND) {
        return <ErrorPage errorMessage="Статья, которую вы пытаетесь открыть, не существует."/>
    } else if (articleState === ArticleState.ERROR) {
        return <ErrorPage errorMessage="Произошла какая-то ошибка при попытке открыть статью."/>
    }

    const articlePreviewUrl = imageApi.getImageUrlByImageId(article["id"]);

    return (
        <div className="ArticlePage">
            <div className="article-content-heading">
                <div className="article-preview-container">
                    <img src={articlePreviewUrl} className="article-preview" alt="Article preview"/>
                </div>
                <div className="article-heading-text">
                    <div className="article-title">{article["name"]}</div>
                    <div className="article-author">Author: {article["author"]}</div>
                    <div className="article-date">Written on {article["createdAtPresentation"]}</div>

                </div>
            </div>

            <div className="article-content"
                 dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(article["content"])}}></div>
        </div>
    );
}

export default withHeaderAndFooter(ArticlePage);