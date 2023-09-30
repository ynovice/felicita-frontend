import {useEffect} from "react";
import "../css/item-checkbox-or-select-filter.css";
import {useSearchParams} from "react-router-dom";

function ItemRadioFilter({getParamName, title, options, chosenValue, setChosenValue}) {

    const [getParams] = useSearchParams();
    useEffect(() => {

        const relatedGetParamValue = getParams.get(getParamName);
        if(relatedGetParamValue !== null) setChosenValue(relatedGetParamValue);

    }, [getParamName, getParams, setChosenValue])

    const selectValue = (value) => {
        setChosenValue(value);
    }

    return (
        <div className="ItemRadioFilter item-checkbox-or-select-filter">
            <div className="title">{title}</div>
            <div className="values">
                {options.map(option => {

                    const {name: optionName, value: optionValue} = option;
                    const htmlIdentifier = optionName + "-" + optionValue;

                    return (
                        <div key={htmlIdentifier} className="value">
                            <input type="radio" id={htmlIdentifier}
                                   checked={chosenValue === optionValue}
                                   onChange={() => selectValue(optionValue)}/>
                            <label htmlFor={htmlIdentifier}>{optionName}</label>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default ItemRadioFilter;