import "../css/Header.css";
import {UpdatedUserContext, UserPresenceState} from "../contexts/UserContext";
import {useContext, useEffect, useState} from "react";
import $ from "jquery";
import {AccessLevel, AppContext} from "../contexts/AppContext";
import categoryApi from "../apis/CategoryApi";

$(window).on('resize', function(){
    let headerMenu = $(".Header .header-menu");
    let win = $(this); //this = window
    if (win.width() < 600) {
        headerMenu.hide();
    } else {
        headerMenu.show();
        // headerMenu.css("display", "flex");
    }
});

function Header() {

    const [mobileMenuOpened, setMobileMenuOpened] = useState(false);

    let toggleMobileMenu = function () {
        let headerMenu = $(".Header .header-menu");
        headerMenu.slideToggle(200);
        headerMenu.css("display", "flex");
        setMobileMenuOpened(!mobileMenuOpened);
    };

    const {accessLevel} = useContext(AppContext);
    const {userPresenceState} = useContext(UpdatedUserContext);

    const [rootCategories, setRootCategories] = useState([]);

    useEffect(() => {

        const abortController = new AbortController();

        categoryApi.getAll(abortController.signal)
            .then(retrievedCategories => setRootCategories(retrievedCategories));

        return () => abortController.abort();
    }, [categoryApi]);

    return (
        <header className="Header">

            <div className="header-upper-part">
                <div className="header-title"><a href="/">FELICITA</a></div>

                <div className="menu-toggler noselect"
                     onClick={() => toggleMobileMenu()}>
                    меню
                </div>

                <ul className="header-menu">

                    {accessLevel === AccessLevel.ADMIN &&
                        <li className="menu-item">
                            <a href="/admin">Админ-панель</a>
                        </li>
                    }

                    <li className="menu-item">
                        <a href="/blog">Блог</a>
                    </li>

                    {userPresenceState !== UserPresenceState.PRESENT &&
                        <li className="menu-item">
                            <a href="/login">Войти</a>
                        </li>
                    }

                    {userPresenceState === UserPresenceState.PRESENT &&
                        <li className="menu-item">
                            <a href="/profile">Профиль</a>
                        </li>
                    }

                    {userPresenceState === UserPresenceState.PRESENT &&
                        <li className="menu-item">
                            <a href="/cart">Корзина</a>
                        </li>
                    }
                </ul>
            </div>

            <div className="header-lower-part">
                <ul className="header-lower-part-links">
                    {rootCategories.map(rootCategory => {
                            return (
                                <li key={"root-category-header-link-container-" + rootCategory["id"]}>
                                    <a className="header-lower-part-link"
                                       href={"/catalog?categoriesIds=" + rootCategory["id"]}>
                                        {rootCategory["name"]}
                                    </a>
                                </li>
                            );
                        }
                    )}
                </ul>
                <div>
                    <a className="header-lower-part-primary-link" href="/catalog">Каталог</a>
                </div>
            </div>


        </header>
    );
}

export default Header;