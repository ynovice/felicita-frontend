import RequestAbortedException from "../exception/RequestAbortedException";
import FailedRequestException from "../exception/FailedRequestException";
import NotAuthorizedException from "../exception/NotAuthorizedException";
import NotFoundException from "../exception/NotFoundException";
import RedirectionException from "../exception/RedirectionException";
import InvalidEntityException from "../exception/InvalidEntityException";
import BadRequestException from "../exception/BadRequestException";
import InternalServerError from "../exception/InternalServerError";
import EntityValidationResult from "../EntityValidationResult";

class BaseApi {

    static _SERVER_DOMAIN = "http://localhost:8080";
    static _API_BASE_URL = this._SERVER_DOMAIN + "/api";

    static _csrfHeaderName = null;
    static _csrfToken = null;

    async performRequest(url, params={}) {

        this.appendCommonDataToRequest(params);

        const response = await fetch(url, params)
            .catch((e) => {
                if (e.name === "AbortError") throw new RequestAbortedException();
            });

        if(response === undefined || response === null) {
            throw new FailedRequestException();
        }

        if(!response.ok) {
            await this.throwExceptionCorrespondingToResponseStatus(response);
        }
    }

    async performRequestGetResponseBody(url, params={}) {

        this.appendCommonDataToRequest(params);

        const response = await fetch(url, params)
            .catch((e) => {
                if (e.name === "AbortError") throw new RequestAbortedException();
            });

        if(response === undefined || response === null) {
            throw new FailedRequestException();
        }

        if(response.ok) {
            return await response.json();
        }

        await this.throwExceptionCorrespondingToResponseStatus(response);
    }

    appendCommonDataToRequest(requestParams) {

        const headers = {};

        const methodsThatNeedCsrf = ["post", "put", "patch", "delete"];
        if(methodsThatNeedCsrf.indexOf(requestParams.method) !== -1) {
            headers[BaseApi.csrfHeaderName] = BaseApi.csrfToken;
        }

        requestParams["headers"] = {...requestParams["headers"], ...headers};
        requestParams["credentials"] = "include";
    }

    async throwExceptionCorrespondingToResponseStatus(response) {

        if(response.status === 403) throw new NotAuthorizedException();

        if(response.status === 404) throw new NotFoundException();

        if(response.status >= 300 && response.status <= 399) throw new RedirectionException();

        if(response.status >= 400 && response.status <= 499) {

            const json = await response.json();

            if(json["invalidFields"])
                throw new InvalidEntityException(new EntityValidationResult(json));

            throw new BadRequestException();
        }

        if(response.status >= 500 && response.status <= 599) throw new InternalServerError();
    }

    static get SERVER_DOMAIN(): string {
        return this._SERVER_DOMAIN;
    }

    static get API_BASE_URL(): string {
        return this._API_BASE_URL;
    }

    static get csrfHeaderName(): null {
        return this._csrfHeaderName;
    }

    static set csrfHeaderName(value: null) {
        this._csrfHeaderName = value;
    }

    static get csrfToken(): null {
        return this._csrfToken;
    }

    static set csrfToken(value: null) {
        this._csrfToken = value;
    }
}

export default BaseApi;