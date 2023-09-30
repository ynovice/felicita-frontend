import {useEffect, useState} from "react";
import "../css/item-checkbox-or-select-filter.css";
import {useSearchParams} from "react-router-dom";


function ItemCheckboxFilter({getParamName, title, options, setIds}) {

    const [chosenIds, setChosenIds] = useState([]);

    const [getParams] = useSearchParams();
    useEffect(() => {

        const relatedGetParamValue = getParams.get(getParamName);

        if(relatedGetParamValue !== null) {

            const splitIds = relatedGetParamValue
                .split(",")
                .map(id => Number(id));

            setChosenIds(splitIds);
            setIds(splitIds);
        }

    }, [getParamName, getParams, setIds]);

    const isIdChosen = (id) => chosenIds.indexOf(id) !== -1;

    const switchOptionById = (id) => {

        const updatedChosenIds = structuredClone(chosenIds);

        const index = updatedChosenIds.indexOf(id);
        if(index === -1)
            updatedChosenIds.push(id);
        else
            updatedChosenIds.splice(index, 1);

        setChosenIds(updatedChosenIds);
        setIds(updatedChosenIds);
    }

    return (
        <div className="ItemStandardPropertyFilter item-checkbox-or-select-filter">
            <div className="title">{title}</div>
            <div className="values">
                {options.map(option => {

                    const {id, name} = option;
                    const htmlIdentifier = id + "-" + name;

                    return (
                        <div key={htmlIdentifier} className="value">
                            <input type="checkbox" id={htmlIdentifier}
                                   checked={isIdChosen(id)}
                                   onChange={() => switchOptionById(id)}/>
                            <label htmlFor={htmlIdentifier}>{name}</label>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default ItemCheckboxFilter;