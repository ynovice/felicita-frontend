import BaseApi from "./BaseApi";

class ItemApi extends BaseApi {

    async getById(id, abortSignal) {
        const requestParams = {
            abortSignal: abortSignal
        };
        return await this.performRequestGetResponseBody(BaseApi.API_BASE_URL + `/item/${id}`, requestParams);
    }

    async create(modifyItemRequestDto) {
        const requestParams = {
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(modifyItemRequestDto)
        };
        return await this.performRequestGetResponseBody(BaseApi.API_BASE_URL + "/item", requestParams);
    }

    async update(id, modifyItemRequestDto) {
        const requestParams = {
            method: "put",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(modifyItemRequestDto)
        };
        return await this.performRequestGetResponseBody(BaseApi.API_BASE_URL + `/item/${id}`, requestParams);
    }

    async deleteById(id) {
        const requestParams = {
            method: "delete"
        };
        await this.performRequest(BaseApi.API_BASE_URL + `/item/${id}`, requestParams);
    }

    async findByParams(searchParams, abortSignal) {
        const requestParams = {
            method: "get",
            abortSignal: abortSignal
        };
        let requestUrl = BaseApi.API_BASE_URL + "/item?" + new URLSearchParams(searchParams);
        return await this.performRequestGetResponseBody(requestUrl, requestParams);
    }
}

const itemApi = new ItemApi();

export default itemApi;