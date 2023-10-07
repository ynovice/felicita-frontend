import BaseApi from "./BaseApi";

class ImageApi extends BaseApi {

    async uploadImage(image) {

        const body = new FormData();
        body.append("image", image);

        const requestParams = {
            method: "post",
            body: body
        };

        return await this.performRequestGetResponseBody(BaseApi.API_BASE_URL + "/image", requestParams);
    }

    async deleteById(id) {
        const requestParams = {
            method: "delete"
        }
        await this.performRequest(BaseApi.API_BASE_URL + `/image/${id}`, requestParams);
    }

    getImageUrlByImageId (id) {
        return BaseApi.API_BASE_URL + "/image/" + id;
    }
}

let imageApi = new ImageApi();

export default imageApi;