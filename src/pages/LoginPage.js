import withHeaderAndFooter from "../hoc/withHeaderAndFooter";
import "../css/LoginPage.css";
import Api from "../Api";

function LoginPage() {

    return (
        <div className={"LoginPage"}>

            <div className="page-title">Тебя не узнать!</div>
            <div className="second-row">Способы входа в аккаунт:</div>

            <div className="social-logos">
                <a href={Api.getServerDomain() + "/oauth2/authorization/google"}>
                    <img src="/ui/oauth/google.png" alt="Google"/>
                </a>
            </div>

            <div className="info-msg">Если вы ещё не создавали аккаунт, то мы создадим его для вас.</div>

        </div>
    )
}

export default withHeaderAndFooter(LoginPage);