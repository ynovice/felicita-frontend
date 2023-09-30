import withHeaderAndFooter from "../hoc/withHeaderAndFooter";
import "../css/MainPage.css";
import {createRef, useContext, useEffect, useMemo, useState} from "react";
import Api from "../Api";
import ItemsCatalog from "../components/ItemsCatalog";
import {ApiContext} from "../contexts/ApiContext";

function MainPage() {

    // [[...sectionOneItems], [...sectionTwoItems]]
    const [sectionsItems, setSectionsItems] = useState([]);

    const sections = useMemo(() => [
        {
            name: "Женское",
            searchParams: {
                categoriesIds: 1
            }
        },
        {
            name: "Мужское",
            searchParams: {
                categoriesIds: 2
            }
        }
    ], []);

    useEffect(() => {

        const abortController = new AbortController();

        if(sections.length > sectionsItems.length) {

            Promise.all(
                sections.map(section =>
                    Api.getItemsPageByFilterParams(section.searchParams, abortController.signal)
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

    const { callbackRequestApi } = useContext(ApiContext);
    const [nameInputRef] = useState(createRef());
    const [phoneInputRef] = useState(createRef());
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [showErrorMessage, setShowErrorMessage] = useState(false);
    const [feedbackErrorMessage, setFeedbackErrorMessage] = useState("")

    function validatePhoneNumber(phoneNumber) {

        // Проверка на длину номера телефона
        if (phoneNumber.length === 11 && phoneNumber.startsWith('8')) {
            return true;
        }

        if (phoneNumber.length === 12 && phoneNumber.startsWith('+7')) {
            return true;
        }

        return false;
    }

    const handleCreateCallbackRequest = () => {

        let isNameValid = true;
        let isPhoneValid = true;

        if(nameInputRef.current.value.length === 0) {
            setShowSuccessMessage(false);
            setShowErrorMessage(true);
            isNameValid = false;
        }

        if(phoneInputRef.current.value.length === 0) {
            setShowSuccessMessage(false)
            setShowErrorMessage(true);
        }

        isPhoneValid = validatePhoneNumber(phoneInputRef.current.value);

        if(!isNameValid && isPhoneValid) {
            setFeedbackErrorMessage("Укажите ваше имя для того, чтобы оставить заявку на обратный звонок");
            return;
        } else if (isNameValid && !isPhoneValid) {
            setFeedbackErrorMessage("Укажите валидный номер телефона, чтобы мы могли вам перезвонить");
            return;
        } else if (!isNameValid && !isPhoneValid) {
            setFeedbackErrorMessage("Укажите ваше имя и номер телефона");
            return;
        }

        callbackRequestApi.create(nameInputRef.current.value, phoneInputRef.current.value)
            .then(() => {
                setShowErrorMessage(false);
                setShowSuccessMessage(true);
            }).catch(() => {
                setShowErrorMessage(true);
                setShowSuccessMessage(false);
                setFeedbackErrorMessage("Произошла ошибка при обработке заявки :(")
            });
    }

    return (
        <div className={"MainPage"}>

            <a href="/catalog" className="banner-container">
                <img src="/ui/banner.png" alt="banner"/>
            </a>

            <div className="feedback-proposal">
                <div className="proposal-title">Оставьте заявку на обратный звонок, и мы с вами свяжемся.</div>
                <div className="feedback-inputs">
                    <input ref={nameInputRef} type="text" className="flct-input" placeholder="Мария"/>
                    <input ref={phoneInputRef} type="text" className="flct-input" placeholder="81234567890"/>
                    <input type="button"
                           className="button"
                           value="Оставить заявку"
                           onClick={() => handleCreateCallbackRequest()}/>
                </div>
                {showSuccessMessage &&
                    <p className="link success">Спасибо! Ваша заявка принята!</p>
                }
                {showErrorMessage &&
                    <p className="link danger">{feedbackErrorMessage}</p>
                }

            </div>

            {sectionsItems.length > 0 &&
                sections.map((section, i) => {
                    return (
                        <div key={"section-" + section["name"]} className="section">
                            <div className="section-name">
                                {section["name"]}
                            </div>
                            <ItemsCatalog items={sectionsItems[i]} oneRow={true} justifyContent={"space-between"}/>
                            <a href={"/catalog?" + new URLSearchParams(section.searchParams)}
                               className="link section-link">
                                Смотреть ещё →
                            </a>
                        </div>
                    );
                })
            }


        </div>
    );
}

export default withHeaderAndFooter(MainPage);