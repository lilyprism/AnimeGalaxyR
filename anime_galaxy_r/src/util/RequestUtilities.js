import axios from "axios";
import App from "../components/App";
import {ToastsStore} from "react-toasts";

export default class RequestUtilities {

    static app_instance;

    static setAppInstance = app => {
        RequestUtilities.app_instance = app;
    };

    static sendGetRequest(endpoint, authorized, config) {
        console.log(endpoint);
        if (authorized) {
            if (config !== undefined) {
                if (config.headers === undefined) {
                    config.headers = {};
                }
                config.headers.Authorization = App.getAuthToken();
            } else {
                config = {};
                config.headers = {};
            }
            config.headers.Authorization = App.getAuthToken();
        }

        return axios.get(`${process.env.REACT_APP_API_URL}/${endpoint}`, config).then(function (res) {
            return res;
        }).catch(error => {
            this.errorHandler(error);
            throw error;
        });
    }

    static sendPostRequest(endpoint, data = {}, authorized = false, config = {}) {
        if (authorized) {
            if (config !== undefined) {
                if (config.headers === undefined) {
                    config.headers = {};
                }
                config.headers.Authorization = App.getAuthToken();
            } else {
                config = {};
                config.headers = {};
            }
            config.headers.Authorization = App.getAuthToken();
        }

        return axios.post(`${process.env.REACT_APP_API_URL}/${endpoint}`, data, config).then(res => {
            return res;
        }).catch(error => {
            this.errorHandler(error);
            throw error;
        });
    }

    static sendPutRequest(endpoint, data, authorized, config) {
        if (authorized) {
            if (config !== undefined) {
                if (config.headers === undefined) {
                    config.headers = {};
                }
                config.headers.Authorization = App.getAuthToken();
            } else {
                config = {};
                config.headers = {};
            }
            config.headers.Authorization = App.getAuthToken();
        }

        return axios.put(`${process.env.REACT_APP_API_URL}/${endpoint}`, data, config).then(res => {
            return res.data;
        }).catch(error => {
            this.errorHandler(error);
            throw error;
        });
    }

    static errorHandler(error) {
        if (error.response !== undefined) {
            switch (error.response.status) {
                case 400:
                    console.log("Bad Request");
                    console.log(error.response);
                    break;
                case 401:
                    console.log("Unauthorized Request");
                    this.app_instance.logout();
                    break;
                case 429:
                    console.log("Too Many Requests");
                    ToastsStore.error("Esta ação encontra-se indisponível neste momento, por favor tente outra vez mais tarde");
                    ToastsStore.error("Se continuares, serás banido");
                    break;
                default:
                    console.log("Unhandled Error");
            }
        }
        throw error;
    }

};
