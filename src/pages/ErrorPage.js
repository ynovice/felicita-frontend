import "../css/ErrorPage.css";

function ErrorPage ({errorMessage = "Что-то пошло не так."}) {

    return (
        <div className="ErrorPage">
            <p className={"page-title"}>Oops :(</p>
            <p className={"error-message"}>{errorMessage}</p>
            <div className="links">
                <span className="link" onClick={() => window.history.back()}>☜ Взад</span>
            </div>
        </div>
    )
}

export default ErrorPage;