import React from "react";

function SizesQuantitiesSelector ({emptyListMessage,
                                   selectedSizesQuantities,
                                   setSelectedSizesQuantities,
                                   existingSizes}) {

    const handleChangeSizeQuantitySelect = (e) => {
        e.preventDefault();

        const chosenSelectIndex = e.target.selectedIndex;
        const chosenSizeId = Number(e.target.options[chosenSelectIndex].value);

        const currentlySelectedSizeId = Number(e.target.options[0].value);

        if(isSizeSelectedById(chosenSizeId)) {  // todo maybe remove
            alert("Ошибка: размер " + getSizeById(chosenSizeId)["name"] + " уже выбран!");
            return;
        }

        const updatedSizesQuantities = structuredClone(selectedSizesQuantities);

        for (let i = 0; i < updatedSizesQuantities.length; i++) {
            if(updatedSizesQuantities[i]["size"]["id"] === currentlySelectedSizeId) {
                updatedSizesQuantities[i]["size"] = getSizeById(chosenSizeId);
                setSelectedSizesQuantities(updatedSizesQuantities);
                return;
            }
        }
    }

    const isSizeSelectedById = (id) => {

        for (let j = 0; j < selectedSizesQuantities.length; j++) {
            if(selectedSizesQuantities[j]["size"]["id"] === id) {
                return true;
            }
        }

        return false;
    }

    const getSizeById = (id) => {

        for (let i = 0; i < existingSizes.length; i++) {
            if(existingSizes[i]["id"] === id) {
                return existingSizes[i];
            }
        }

        return null;
    }

    const getUnselectedSizes = () => {

        const unselectedSizes = [];

        for (let i = 0; i < existingSizes.length; i++) {
            if(!isSizeSelectedById(existingSizes[i]["id"])) {
                unselectedSizes.push(existingSizes[i]);
            }
        }

        return unselectedSizes;
    }

    const handleSizeQuantityQuantityChange = (e, sizeId) => {
        e.preventDefault();

        const updatedValue = e.target.value;

        const updatedSizesQuantities = structuredClone(selectedSizesQuantities);

        for (let i = 0; i < updatedSizesQuantities.length; i++) {
            if(updatedSizesQuantities[i]["size"]["id"] === sizeId) {
                updatedSizesQuantities[i]["quantity"] = updatedValue;
                setSelectedSizesQuantities(updatedSizesQuantities);
                return;
            }
        }
    }

    const handleUnselectSizeQuantity = (sizeId) => {

        const updatedSizesQuantities = [];

        for (let i = 0; i < selectedSizesQuantities.length; i++) {
            if(selectedSizesQuantities[i]["size"]["id"] !== sizeId)
                updatedSizesQuantities.push(selectedSizesQuantities[i]);
        }

        setSelectedSizesQuantities(updatedSizesQuantities);
    }

    const areAllSizesSelected = () => {
        return existingSizes.length === selectedSizesQuantities.length;
    }

    const markNextUnselectedSizeAsSelected = () => {

        const sizeQuantity = {size: getUnselectedSizes()[0], quantity: ""};

        const updatedList = structuredClone(selectedSizesQuantities);
        updatedList.push(sizeQuantity);
        setSelectedSizesQuantities(updatedList);
    }

    return (
        <div className="SizesQuantitiesSelector section form-row col">
            {selectedSizesQuantities.length === 0 && <p>{emptyListMessage}</p>}
            {selectedSizesQuantities.map(sq => {

                const {id: sizeId, name: sizeName} = sq["size"];

                return (
                    <div className="selects-row" key={`sq-size-id-${sizeId}`}>

                        <select className="flct-input"
                                value={sizeId}
                                onChange={(e) => handleChangeSizeQuantitySelect(e)}>
                            <option className="flct-input" value={sizeId}>
                                {sizeName}
                            </option>
                            {getUnselectedSizes().map(unselectedSize => {
                                return (
                                    <option className="flct-input"
                                            value={unselectedSize["id"]}
                                            key={unselectedSize["id"]}>
                                        {unselectedSize["name"]}
                                    </option>
                                );
                            })}
                        </select>
                        <input className="flct-input"
                               type="number"
                               value={sq["quantity"]}
                               placeholder="Количество (шт)"
                               onChange={(e) => handleSizeQuantityQuantityChange(e, sizeId)}/>
                        <span className="link danger"
                              onClick={() => handleUnselectSizeQuantity(sizeId)}>
                            Убрать
                        </span>
                    </div>
                );
            })}
            {!areAllSizesSelected() &&
                <span className="link"
                      onClick={() => markNextUnselectedSizeAsSelected()}>
                    Добавить
                </span>
            }
        </div>
    );
}

export default SizesQuantitiesSelector;