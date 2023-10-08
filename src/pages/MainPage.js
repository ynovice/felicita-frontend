import withHeaderAndFooter from "../hoc/withHeaderAndFooter";
import "../css/MainPage.css";
import {useEffect, useMemo, useState} from "react";
import ItemsCatalog from "../components/ItemsCatalog";
import articleApi from "../apis/ArticleApi";
import ArticlesContainer from "../components/ArticlesContainer";
import itemApi from "../apis/ItemApi";

function MainPage() {

    // [[...sectionOneItems], [...sectionTwoItems]]
    const [sectionsItems, setSectionsItems] = useState([]);
    const sections = useMemo(() => [
        {
            name: "Популярное",
            searchParams: {
                categoriesIds: 14
            }
        },
        {
            name: "Осень",
            searchParams: {
                categoriesIds: 15
            }
        }
    ], []);
    useEffect(() => {

        const abortController = new AbortController();

        if (sections.length > sectionsItems.length) {

            Promise.all(
                sections.map(section =>
                    itemApi.findByParams(section.searchParams, abortController.signal)
                        .then(retrievedItemsPage => retrievedItemsPage["items"]))
            )
                .then(items => {
                    const updatedSectionsItems = [];
                    updatedSectionsItems.push(...items);
                    setSectionsItems(updatedSectionsItems);
                });
        }

        return () => abortController.abort();
    }, [sections, sectionsItems.length]);

    const [articles, setArticles] = useState([]);
    useEffect(() => {
        const abortController = new AbortController();

        articleApi.getAll(abortController.signal)
            .then(retrievedArticles => setArticles(retrievedArticles));

        return () => abortController.abort();
    }, [])

    return (
        <div className="MainPage">
            <a href="/catalog" className="banner-container">
                <img src="/ui/banner.png" alt="banner"/>
            </a>
            {
                sectionsItems.length > 0 &&
                sections.map((section, i) => {
                    return (
                        <div key={"section-" + section["name"]} className="section">
                            <div className="section-name">
                                {section["name"]}
                            </div>
                            <ItemsCatalog items={sectionsItems[i]} oneRow={true} justifyContent={"space-between"}/>
                            <a href={"/catalog?" + new URLSearchParams(section.searchParams)}
                               className="link section-link">
                                Больше →
                            </a>
                        </div>
                    );
                })
            }
            {
                articles.length > 0 &&
                <div className="section larger-gap">
                    <div className="section-name">Блог</div>
                    <ArticlesContainer articles={articles} oneRowMode={true}/>
                    <a href="/blog" className="link section-link">Больше →</a>
                </div>
            }
        </div>
    );
}

export default withHeaderAndFooter(MainPage);