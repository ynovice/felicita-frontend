import RedirectionException from "./exception/RedirectionException";
import BadRequestException from "./exception/BadRequestException";
import InternalServerError from "./exception/InternalServerError";
import NotAuthorizedException from "./exception/NotAuthorizedException";
import FailedRequestException from "./exception/FailedRequestException";
import EntityValidationResult from "./EntityValidationResult";
import InvalidEntityException from "./exception/InvalidEntityException";
import NotFoundException from "./exception/NotFoundException";
import RequestAbortedException from "./exception/RequestAbortedException";

/**
 * @deprecated
 */
const Api = (function () {

    const SERVER_DOMAIN = "http://localhost:8080";
    const API_BASE_URL = SERVER_DOMAIN + "/api";

    let csrfHeaderName = null;
    let csrfToken = null;

    const throwCorrespondingException = async (response) => {

        if(response === null) throw new FailedRequestException();

        if(response.status === 403) throw new NotAuthorizedException();

        if(response.status === 404) throw new NotFoundException();

        if(response.status >= 300 && response.status <= 399) throw new RedirectionException();

        if(response.status >= 400 && response.status <= 499) {

            const json = await response.json();

            if(json["invalidFields"]) throw new InvalidEntityException(new EntityValidationResult(json));

            throw new BadRequestException();
        }

        if(response.status >= 500 && response.status <= 599) throw new InternalServerError();
    }

    return {

        logout: async function() {

            const response = await fetch(API_BASE_URL + "/logout", {
                method: "post",
                credentials: "include",
                headers: {
                    [csrfHeaderName]: csrfToken
                }
            }).catch(() => null);

            if(!response || !response.ok) {
                await throwCorrespondingException(response);
            }
        },

        getCsrfData: async function (abortSignal) {

            let aborted = false;

            const response = await fetch(API_BASE_URL + "/csrf", {
                signal: abortSignal,
                credentials: "include"
            }).catch((e) => {
                if(e.name === "AbortError") aborted = true;
                return null;
            });

            if(aborted) throw new RequestAbortedException();
            if(response === null) throw new FailedRequestException()

            if(response && response.ok) {
                return await response.json();
            }

            await throwCorrespondingException(response);
        },

        getAllCategories: async function (abortSignal) {

            const response = await fetch(API_BASE_URL + "/category", {
                signal: abortSignal,
                credentials: "include"
            }).catch(() => null);

            if(response && response.ok) {
                return await response.json();
            }

            await throwCorrespondingException(response);
        },

        getAllMaterials: async function (abortSignal) {

            const response = await fetch(API_BASE_URL + "/material", {
                signal: abortSignal,
                credentials: "include"
            }).catch(() => null);

            if(response && response.ok) {
                return await response.json();
            }

            await throwCorrespondingException(response);
        },

        getAllColors: async function (abortSignal) {

            const response = await fetch(API_BASE_URL + "/color", {
                signal: abortSignal,
                credentials: "include"
            }).catch(() => {
                return null;
            });

            if(response && response.ok) {
                return await response.json();
            }

            await throwCorrespondingException(response);
        },

        getAllSizes: async function (abortSignal) {

            const response = await fetch(API_BASE_URL + "/size", {
                signal: abortSignal,
                credentials: "include"
            }).catch(() => null);

            if(response && response.ok) {
                return await response.json();
            }

            await throwCorrespondingException(response);
        },

        uploadImage: async function (image, abortSignal) {

            const body = new FormData();
            body.append("image", image);

            const response = await fetch(API_BASE_URL + "/image", {
                signal: abortSignal,
                credentials: "include",
                method: "post",
                headers: {
                    [csrfHeaderName]: csrfToken
                },
                body: body
            }).catch(() => null);

            if(response && response.ok) {
                return await response.json();
            }

            await throwCorrespondingException(response);
        },

        getCart: async function (abortSignal) {

            const response = await fetch(API_BASE_URL + "/cart", {
                signal: abortSignal,
                credentials: "include"
            }).catch(() => null)

            if(response && response.ok) {
                return await response.json();
            }

            await throwCorrespondingException(response);
        },

        incrementItemQuantityInCart: async function (itemId, sizeId) {

            const urlSearchParams = new URLSearchParams({
                itemId, sizeId,
                action: "append"
            });

            const response = await fetch(API_BASE_URL + "/cart?" + urlSearchParams, {
                credentials: "include",
                method: "put",
                headers: {
                    [csrfHeaderName]: csrfToken
                }
            }).catch(() => null);

            if(response && response.ok) {
                return await response.json();
            }

            await throwCorrespondingException(response);
        },

        removeOneItemFromCartBySize: async function (itemId, sizeId) {

            const urlSearchParams = new URLSearchParams({
                itemId, sizeId,
                action: "removeOne"
            });

            const response = await fetch(API_BASE_URL + "/cart?" + urlSearchParams, {
                credentials: "include",
                method: "put",
                headers: {
                    [csrfHeaderName]: csrfToken,
                }
            }).catch(() => null);

            if(response && response.ok) {
                return await response.json();
            }

            await throwCorrespondingException(response);
        },

        removeAllItemsFromCartBySize: async function (itemId, sizeId) {

            const urlSearchParams = new URLSearchParams({
                itemId, sizeId,
                action: "removeAll"
            });

            const response = await fetch(API_BASE_URL + "/cart?" + urlSearchParams, {
                credentials: "include",
                method: "put",
                headers: {
                    [csrfHeaderName]: csrfToken,
                }
            }).catch(() => null);

            if(response && response.ok) {
                return await response.json();
            }

            await throwCorrespondingException(response);
        },

        getItemsPageByFilterParams: async function (searchParams, abortSignal) {

            const response = await fetch(API_BASE_URL + "/item?" + new URLSearchParams(searchParams), {
                signal: abortSignal,
                credentials: "include",
            }).catch(() => null);

            if(response && response.ok) {
                return await response.json();
            }

            await throwCorrespondingException(response);
        },

        getArticleById: async function (id, abortSignal) {

            const response = await fetch(API_BASE_URL + "/article/" + id, {
                signal: abortSignal,
                credentials: "include"
            }).catch(() => null)

            if(response && response.ok) {
                return await response.json();
            }

            await throwCorrespondingException(response);
        },

        reserveAllItemsInCart: async function() {

            const response = await fetch(API_BASE_URL + "/reserve", {
                credentials: "include",
                method: "post",
                headers: {
                    [csrfHeaderName]: csrfToken
                }
            }).catch(() => null);

            if(response && response.ok) {
                return await response.json();
            }

            await throwCorrespondingException(response);
        },

        getReserveById: async function(id, abortSignal) {

            const response = await fetch(API_BASE_URL + "/reserve/" + id, {
                signal: abortSignal,
                credentials: "include"
            }).catch(() => null)

            if(response && response.ok) {
                return await response.json();
            }

            await throwCorrespondingException(response);
        },

        getReservesForCurrentUser: async function (abortSignal) {

            const response = await fetch(API_BASE_URL + "/reserve", {
                signal: abortSignal,
                credentials: "include"
            }).catch(() => null)

            if(response && response.ok) {
                return await response.json();
            }

            await throwCorrespondingException(response);
        },

        getAllArticles: async function (abortSignal) {

            const response = await fetch(API_BASE_URL + "/article", {
                signal: abortSignal,
                credentials: "include"
            }).catch(() => null)

            if(response && response.ok) {
                return await response.json();
            }

            await throwCorrespondingException(response);
        },

        deleteArticleById: async function (id) {

            const response = await fetch(API_BASE_URL + "/article/" + id, {
                credentials: "include",
                method: "delete",
                headers: {
                    [csrfHeaderName]: csrfToken
                }
            }).catch(() => null);

            if(response && response.ok) return true;

            await throwCorrespondingException(response);
        },

        getImageUrlByImageId: function(id) {
            return API_BASE_URL + "/image/" + id;
        },

        getBaseApiUrl: function () {
            return API_BASE_URL;
        },
        getServerDomain: function () {
            return SERVER_DOMAIN;
        },

        setCsrfHeaderName(name) {
            csrfHeaderName = name;
        },
        setCsrfToken(token) {
            csrfToken = token;
        }
    }
})();

export default Api;