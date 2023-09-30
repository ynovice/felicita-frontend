import BaseApi from "./BaseApi";

class ReserveApi extends BaseApi {

    async getReservesPageForCurrentUser(pageNumber, abortSignal) {
        const requestParams = {
            signal: abortSignal
        };
        return await this.performRequestGetResponseBody(
            `${BaseApi.API_BASE_URL}/reserve?page=${pageNumber}`,
            requestParams
        );
    }

    async getReservesPageAdminScope(pageNumber, abortSignal) {
        const requestParams = {
            signal: abortSignal
        };
        return await this.performRequestGetResponseBody(
            BaseApi.API_BASE_URL + `/reserve?page=${pageNumber}&scope=admin`,
            requestParams
        );
    }

    async deleteById(id) {
        const requestParams = {
            method: "delete"
        };
        await this.performRequest(BaseApi.API_BASE_URL + `/reserve/${id}`, requestParams);
    }

    async cancelById(id) {
        const requestParams = {
            method: "delete"
        };
        await this.performRequest(BaseApi.API_BASE_URL + `/reserve/${id}?action=cancel`, requestParams);
    }
}

const reserveApi = new ReserveApi();

export default reserveApi;