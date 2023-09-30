import React from "react";

function ItemCategoriesSelector({emptyListMessage,
                                 selectedCategoriesSequences,
                                 setSelectedCategoriesSequences,
                                 existingCategoriesTrees}) {

    const handleChangeCategorySelect = (e) => {
        e.preventDefault();

        const chosenSelectIndex = e.target.selectedIndex;
        const chosenCategoryId = Number(e.target.options[chosenSelectIndex].value);

        if(isCategorySelectedById(chosenCategoryId)) {
            alert("Ошибка: категория " + getCategoryById(chosenCategoryId)["name"] + " уже выбрана!");
            return;
        }

        const currentlySelectedCategoryId = Number(e.target.options[0].value);

        const updatedSelectedCategoriesSequences = [];

        for (let i = 0; i < selectedCategoriesSequences.length; i++) {

            const currentSequence = selectedCategoriesSequences[i];

            if(currentSequence.indexOf(currentlySelectedCategoryId) === -1) {
                updatedSelectedCategoriesSequences.push(currentSequence);
            } else {

                const updatedSequence = [];

                for (let j = 0; j < currentSequence[j]; j++) {
                    if(currentSequence[j] !== currentlySelectedCategoryId) {
                        updatedSequence.push(currentSequence[j]);
                    } else {
                        updatedSequence.push(chosenCategoryId);
                        break;
                    }
                }

                updatedSelectedCategoriesSequences.push(updatedSequence);
            }
        }

        setSelectedCategoriesSequences(updatedSelectedCategoriesSequences);
    }

    const isCategorySelectedById = (id) => {

        for (let i = 0; i < selectedCategoriesSequences.length; i++) {
            for (let j = 0; j < selectedCategoriesSequences[i].length; j++) {
                if(selectedCategoriesSequences[i][j] === id) return true;
            }
        }

        return false;
    }

    const getCategoryById = (id, source=existingCategoriesTrees) => {

        for (let i = 0; i < source.length; i++) {

            if(source[i]["id"] === id) {
                return source[i];
            }

            let resultFromChildren = getCategoryById(id, source[i]["subCategories"]);
            if(resultFromChildren !== null) {
                return resultFromChildren;
            }
        }

        return null;
    }

    const getUnselectedCategorySiblingsById = (id) => {

        const category = getCategoryById(id);

        return category["parentId"] == null ?
            filterOutSelectedCategories(existingCategoriesTrees) :
            filterOutSelectedCategories(getCategoryById(category["parentId"])["subCategories"]);
    }

    const filterOutSelectedCategories = (list) => {

        const filteredList = [];

        for (let i = 0; i < list.length; i++) {
            if(!isCategorySelectedById(list[i]["id"])) filteredList.push(list[i]);
        }

        return filteredList;
    }

    const getHasSubCategoriesById = (id) => {
        return getCategoryById(id)["subCategories"].length !== 0;
    }

    const handleAddSubCategorySelect = (parentId) => {

        const children = getCategoryById(parentId)["subCategories"];

        let categoryIdToAdd = -1;
        for (let i = 0; i < children.length; i++) {
            if(!isCategorySelectedById(children[i]["id"])) {
                categoryIdToAdd = children[i]["id"];
            }
        }

        if(categoryIdToAdd === -1) {
            return;
        }

        const updatedSelectedCategoriesSequences = [];
        for (let i = 0; i < selectedCategoriesSequences.length; i++) {

            const currentSequence = selectedCategoriesSequences[i];

            if(currentSequence.indexOf(parentId) === -1) {
                updatedSelectedCategoriesSequences.push(currentSequence);
            } else {

                const updatedSequence = structuredClone(currentSequence);
                updatedSequence.push(categoryIdToAdd);
                updatedSelectedCategoriesSequences.push(updatedSequence);
            }
        }

        setSelectedCategoriesSequences(updatedSelectedCategoriesSequences);
    }

    const handleReduceCategoriesSequenceLength = (rootCategoryId) => {

        let updatedSelectedCategoriesSequences = [];

        for (let i = 0; i < selectedCategoriesSequences.length; i++) {

            const currentSequence = selectedCategoriesSequences[i];

            if(currentSequence[0] !== rootCategoryId) {
                updatedSelectedCategoriesSequences.push(currentSequence);
            } else if(currentSequence.length > 1) {
                let updatedSequence = structuredClone(currentSequence);
                updatedSequence = updatedSequence.slice(0, updatedSequence.length - 1);
                updatedSelectedCategoriesSequences.push(updatedSequence);
            }
        }

        setSelectedCategoriesSequences(updatedSelectedCategoriesSequences);
    }

    const getAllRootCategoriesAreSelected = () => {
        return selectedCategoriesSequences.length === existingCategoriesTrees.length;
    }

    const handleAddRootCategorySelect = (e) => {
        e.preventDefault();

        for (let i = 0; i < existingCategoriesTrees.length; i++) {

            let currentRootCategory = existingCategoriesTrees[i];
            let categoryIsChosen = false;

            for (let j = 0; j < selectedCategoriesSequences.length; j++) {
                if(selectedCategoriesSequences[j][0] === currentRootCategory["id"]) {
                    categoryIsChosen = true;
                }
            }

            if(!categoryIsChosen) {
                const updatedList = structuredClone(selectedCategoriesSequences);
                updatedList.push([currentRootCategory["id"]]);
                setSelectedCategoriesSequences(updatedList);
            }
        }
    }


    return (
        <div className="ItemCategoriesSelector section form-row col">
            {selectedCategoriesSequences.length === 0 && <p>{emptyListMessage}</p>}
            {selectedCategoriesSequences.map(sequence => {

                return (
                    <div key={sequence[0]} className="selects-row">
                        {sequence.map(categoryId => {

                            return (
                                <React.Fragment key={`selector-category-${categoryId}`}>
                                    <select className="flct-input"
                                            value={categoryId}
                                            onChange={(e) => handleChangeCategorySelect(e)}>

                                        <option className="flct-input"
                                            value={categoryId}>{getCategoryById(categoryId)["name"]}
                                        </option>
                                        {
                                            getUnselectedCategorySiblingsById(categoryId).map(sibling => {
                                                return (
                                                    <option className="flct-input"
                                                            key={sibling["id"]}
                                                            value={sibling["id"]}>{sibling["name"]}</option>
                                                );
                                            })
                                        }
                                    </select>
                                    {sequence.indexOf(categoryId) !== sequence.length - 1 && " > "}
                                </React.Fragment>
                            );
                        })}
                        {getHasSubCategoriesById(sequence[sequence.length - 1]) &&
                            <span className="link"
                                  onClick={() => handleAddSubCategorySelect(sequence[sequence.length - 1])}>
                                Уточнить
                            </span>
                        }
                        <span className="link danger"
                              onClick={() => handleReduceCategoriesSequenceLength(sequence[0])}>
                            Убрать
                        </span>
                    </div>
                );
            })}
            {!getAllRootCategoriesAreSelected() &&
                <span
                    className="link"
                    onClick={(e) => handleAddRootCategorySelect(e)}>
                        Добавить
                    </span>
            }
        </div>
    );
}

export default ItemCategoriesSelector;