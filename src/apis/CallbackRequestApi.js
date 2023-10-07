import BaseApi from "./BaseApi";

class CallbackRequestApi extends BaseApi {

    async create(name, phone) {  // todo refactor
        const requestParams = {
            // method: "post",
            // body: JSON.stringify(requestDto),
            // "Content-Type": "application/json"
        };
        await this.performRequestGetResponseBody(
            BaseApi.API_BASE_URL + `/callbackrequest?phone=${encodeURIComponent(phone)}&name=${encodeURIComponent(name)}`,
            requestParams
        );
    }

    async getAll(abortSignal) {
        const requestParams = {
            signal: abortSignal
        };
        return await this.performRequestGetResponseBody(BaseApi.API_BASE_URL + "/callbackrequest", requestParams);
    }

    async deleteById(id) {
        const requestParams = {
            method: "delete"
        };
        return await this.performRequest(BaseApi.API_BASE_URL + `/callbackrequest/${id}`, requestParams);
    }
}

let callbackRequestApi = new CallbackRequestApi();

export default callbackRequestApi;