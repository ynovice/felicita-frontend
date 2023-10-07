import withHeaderAndFooter from "../hoc/withHeaderAndFooter";
import "../css/ProfilePage.css";
import $ from "jquery";
import {UpdatedUserContext} from "../contexts/UserContext";
import React, {useContext} from "react";
import {SOCIAL_LOGIN_LOGOS_URLS} from "../constants";
import requiresUser from "../hoc/requiresUser";
import Button from "../components/Button";
import userApi from "../apis/UserApi";

function ProfilePage() {

    const handleCredentialDetailsExpand = e => {

        e.target.classList.toggle("rotated");

        const credentialId = e.target.getAttribute("data-id");
        let credentialDetails = $(`.credential-details-container[data-id=${credentialId}]`);
        credentialDetails.slideToggle(200);
    }

    const handleLogoutClick = () => {

        userApi.logout()
            .then(() => window.location.href = "/")
            .catch(() => alert("Что-то пошло не так"));
    }

    const { user } = useContext(UpdatedUserContext);

    const { username, oauth2Credentials } = user;

    return (
        <div className="ProfilePage">
            <div className="section">
                <p>Привет, <span className="username">{username}</span></p>
                <p>Это страинца твоего профиля</p>
                <div className="links">
                    <a href="/reserve" className="link">Резервы</a>
                </div>
            </div>
            <div className="section">
                <p>Учётные данные:</p>
                <div className="credentials">

                    {oauth2Credentials.map(credential => {

                        const {externalId, authServer, presentation, createdAt} = credential;

                        return (
                            <div className="credential" key={externalId}>

                                <div className="row">
                                    <div className="left">
                                        <div className="credential-name">
                                            <img src={SOCIAL_LOGIN_LOGOS_URLS[authServer]} alt="Google"/>
                                            <p>{authServer}</p>
                                        </div>
                                        <div className="credential-presentation">
                                            {presentation}
                                        </div>
                                    </div>
                                    <div className="right">
                                        <img data-id={"0"}
                                             src="/ui/down-arrow.png"
                                             alt="expand"
                                             onClick={e => handleCredentialDetailsExpand(e)}/>
                                    </div>
                                </div>

                                <div className="credential-details-container" data-id={"0"}>
                                    <div className="credential-details">
                                        <p>Привязан {createdAt}</p>
                                        <p className={"you-cant"}>Нельзя отвязать</p>
                                    </div>
                                </div>

                            </div>
                        );
                    })}
                </div>
            </div>
            <div className="section">
                <Button value="Выйти" onClick={() => handleLogoutClick()} danger={true}/>
            </div>
        </div>
    );
}

export default withHeaderAndFooter(requiresUser(
    ProfilePage, "Чтобы просмотреть эту страницу, нужно войти в аккаунт."
));