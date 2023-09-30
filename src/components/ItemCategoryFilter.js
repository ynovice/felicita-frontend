import React, {useEffect} from "react";
import "../css/item-checkbox-or-select-filter.css"
import {useSearchParams} from "react-router-dom";

function ItemCategoryFilter ({getParamName, title, categoriesTrees, chosenIds, setChosenIds}) {

    const [getParams] = useSearchParams();
    useEffect(() => {

        const relatedGetParamValue = getParams.get(getParamName);

        if(relatedGetParamValue !== null) {

            const splitIds = relatedGetParamValue
                .split(",")
                .map(id => Number(id));

            setChosenIds(splitIds);
        }

    }, [getParamName, getParams, setChosenIds]);

    const getIsCategoryChosenById = (id, sourceIdsArray=chosenIds) => {

        if(sourceIdsArray.indexOf(id) !== - 1) return true;

        const children = getCategoryById(id)["subCategories"];
        for (let i = 0; i < children.length; i++) {
            if(sourceIdsArray.indexOf(children[i]["id"]) !== -1) {
                return true;
            }
        }

        return false;
    }

    const getCategoryById = (id) => {

        const searchQueue = structuredClone(categoriesTrees);

        while (searchQueue.length > 0) {

            const currentCategory = searchQueue.pop();

            if(currentCategory["id"] === id) return currentCategory;

            searchQueue.push(...structuredClone(currentCategory["subCategories"]));
        }

        return null;
    }

    const switchCategoryById = (id) => {

        const currentCategory = getCategoryById(id);
        const currentIsChosen = getIsCategoryChosenById(id);

        const updatedChosenIds = structuredClone(chosenIds);

        if(currentIsChosen) {

            updatedChosenIds.splice(chosenIds.indexOf(currentCategory["id"]), 1);

            let categoriesToDeleteQueue = currentCategory["subCategories"];
            while(categoriesToDeleteQueue.length > 0) {

                const currentSubCategory = categoriesToDeleteQueue.pop();
                updatedChosenIds.splice(chosenIds.indexOf(currentSubCategory["id"]), 1);

                categoriesToDeleteQueue.push(...currentSubCategory["subCategories"]);
            }

            if(currentCategory["parentId"]) {

                const currentParent = getCategoryById(currentCategory["parentId"]);

                let parentHasAtLeastOneChosenSubCategory = false;
                for (let i = 0; i < currentParent["subCategories"].length; i++) {

                    const currentSubCategory = currentParent["subCategories"][i];

                    if(updatedChosenIds.indexOf(currentSubCategory["id"]) !== -1) {
                        parentHasAtLeastOneChosenSubCategory = true;
                        break;
                    }
                }

                if(!parentHasAtLeastOneChosenSubCategory) {
                    updatedChosenIds.push(currentParent["id"]);
                }
            }
        }

        if(!currentIsChosen) {

            updatedChosenIds.push(currentCategory["id"]);

            if(currentCategory["parentId"]) {

                const parentIdIndex = updatedChosenIds.indexOf(currentCategory["parentId"]);

                if(parentIdIndex !== -1) updatedChosenIds.splice(parentIdIndex, 1);
            }
        }

        setChosenIds(updatedChosenIds);
        console.log(updatedChosenIds);
    }

    const renderCategoriesRecursively = (categoriesList) => {

        return categoriesList.map((category) => {

            const {id: categoryId, name: categoryName, subCategories: categoryChildren} = category;
            const categoryIsChosen = getIsCategoryChosenById(categoryId);
            const htmlIdentifier = "category-" + categoryId;

            return (
                <React.Fragment key={htmlIdentifier}>
                    <div className="value">
                        <input id={htmlIdentifier}
                               type="checkbox"
                               checked={categoryIsChosen}
                               onChange={() => switchCategoryById(categoryId)}/>
                        <label htmlFor={htmlIdentifier}>{categoryName}</label>
                    </div>

                    {categoryIsChosen && categoryChildren.length > 0 &&
                        <div className="sub-values">
                            {renderCategoriesRecursively(categoryChildren)}
                        </div>
                    }

                </React.Fragment>
            );
        });
    }

    return (
        <div className="ItemCategoryFilter item-checkbox-or-select-filter">

            <div className="title">{title}</div>

            <div className="values">

                {categoriesTrees && renderCategoriesRecursively(categoriesTrees)}

            </div>
        </div>
    );
}

export default ItemCategoryFilter;