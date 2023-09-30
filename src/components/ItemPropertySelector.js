import React from "react";

function ItemPropertySelector({emptyListMessage, selectedIds, setSelectedIds, propertySource}) {

    const getPropertyById = (id) => {

        for (let i = 0; i < propertySource.length; i++) {
            if(propertySource[i]["id"] === id) {
                return propertySource[i];
            }
        }

        return null;
    }

    const handleChangePropertySelect = (e) => {

        const chosenSelectIndex = e.target.selectedIndex;
        const chosenPropertyId = Number(e.target.options[chosenSelectIndex].value);

        const currentlySelectedPropertyId = Number(e.target.options[0].value);

        if(isPropertySelectedById(chosenPropertyId)) {  // todo maybe remove
            alert("Ошибка: это свойство уже выбрано!");
            return;
        }

        const indexOfCurrentlySelectedPropertyId = selectedIds.indexOf(currentlySelectedPropertyId);

        const updatedList = structuredClone(selectedIds);
        updatedList[indexOfCurrentlySelectedPropertyId] = chosenPropertyId;
        setSelectedIds(updatedList);
    }

    const isPropertySelectedById = (id) => {
        return selectedIds.indexOf(id) !== -1;
    }

    const getUnselectedProperties = () => {

        const unselectedProperties = [];

        for (let i = 0; i < propertySource.length; i++) {
            if(!isPropertySelectedById(propertySource[i]["id"])) {
                unselectedProperties.push(propertySource[i]);
            }
        }

        return unselectedProperties;
    }

    const handleUnselectPropertyById = (id) => {

        const updatedList = structuredClone(selectedIds);
        updatedList.splice(updatedList.indexOf(id), 1);
        setSelectedIds(updatedList);
    }

    const areAllPropertiesSelected = () => {
        return selectedIds.length === propertySource.length;
    }

    const markNextUnselectedPropertyAsSelected = () => {

        for (let i = 0; i < propertySource.length; i++) {
            if(!isPropertySelectedById(propertySource[i]["id"])) {
                const updatedList = structuredClone(selectedIds);
                updatedList.push(propertySource[i]["id"]);
                setSelectedIds(updatedList);
                return;
            }
        }
    }

    return (
        <div className="ItemPropertySelector section form-row col">
            {selectedIds.length === 0 && <p>{emptyListMessage}</p>}
            {selectedIds.map(id => {

                const { name } = getPropertyById(id);

                return (
                    <div key={`property-${id}-${name}`} className="selects-row">
                        <select className="flct-input"
                                value={id}
                                onChange={(e) => handleChangePropertySelect(e)}>
                            <option className="flct-input" value={id}>{name}</option>
                            {getUnselectedProperties().map((unselectedProperty) => {
                                return (
                                    <option className="flct-input"
                                            key={`unselected-${unselectedProperty["id"]}-${unselectedProperty["name"]}`}
                                            value={unselectedProperty["id"]}>
                                        {unselectedProperty["name"]}
                                    </option>
                                );
                            })}
                        </select>
                        <span
                            className="link danger"
                            onClick={() => handleUnselectPropertyById(id)}>
                            Убрать
                        </span>
                    </div>
                );
            })}
            {!areAllPropertiesSelected() &&
                <span
                    className="link"
                    onClick={() => markNextUnselectedPropertyAsSelected()}>
                    Добавить
                </span>
            }
        </div>
    );
}

export default ItemPropertySelector;