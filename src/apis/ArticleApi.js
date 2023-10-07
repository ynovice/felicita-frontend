import BaseApi from "./BaseApi";

class ArticleApi extends BaseApi {

    async getById(id, abortSignal) {
        const requestParams = {
            abortSignal: abortSignal
        };
        return await this.performRequestGetResponseBody(BaseApi.API_BASE_URL + `/article/${id}`, requestParams);
    }

    async create(createArticleRequestDto) {
        const requestParams = {
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(createArticleRequestDto)
        };
        return await this.performRequestGetResponseBody(BaseApi.API_BASE_URL + "/article", requestParams)
    }

    async update(updateArticleRequestDto) {
        const requestParams = {
            method: "put",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(updateArticleRequestDto)
        };
        return await this.performRequestGetResponseBody(BaseApi.API_BASE_URL + "/article", requestParams)
    }
}

const articleApi = new ArticleApi();

export default articleApi;