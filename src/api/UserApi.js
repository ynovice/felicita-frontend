import BaseApi from "./BaseApi";

class UserApi extends BaseApi {

    async getCurrentUser(abortSignal) {
        const requestParams = {
            signal: abortSignal,
        };
        return await this.performRequestGetResponseBody(BaseApi.API_BASE_URL + "/user", requestParams);
    }

    async logout() {
        const requestParams = {
            method: "post",
        };
        await this.performRequest(BaseApi.API_BASE_URL + "/logout", requestParams);
    }
}

let userApi = new UserApi();

export default userApi;