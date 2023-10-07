import BaseApi from "./BaseApi";

class CategoryApi extends BaseApi {

    async getAll(abortSignal) {
        const requestParams = {
            abortSignal: abortSignal,
        }
        return await this.performRequestGetResponseBody(BaseApi.API_BASE_URL + "/category", requestParams);
    }
}

const categoryApi = new CategoryApi();

export default categoryApi;