import {useContext} from "react";
import {AccessLevel, AppContext} from "../contexts/AppContext";
import ErrorPage from "../pages/ErrorPage";

function adminAccessOnly(TargetComponent) {

    function AdminAccessOnlyComponent() {

        const { accessLevel } = useContext(AppContext);

        if(accessLevel === AccessLevel.UNDEFINED) return;

        if(accessLevel !== AccessLevel.ADMIN)
            return <ErrorPage errorMessage="Вы должны обладать правами администратора для просмотра этой страницы."/>;

        return <TargetComponent />;
    }

    return AdminAccessOnlyComponent;
}

export default adminAccessOnly;