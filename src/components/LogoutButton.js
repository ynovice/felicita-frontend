import Api from "../Api";

/** @deprecated */
function LogoutButton ({redirect}) {

    async function clickHandler(e) {
        e.preventDefault();

        if(await Api.logout()) {
            window.location.href = redirect;
        } else {
            alert("Что-то пошло не так");
        }
    }

    return (
        <a className={"button danger"} onClick={clickHandler}>Выйти</a>
    );
}

export default LogoutButton;