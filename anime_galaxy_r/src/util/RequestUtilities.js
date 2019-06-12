import axios from "axios";
import App from "../components/App";

export default class RequestUtilities {

    static app_instance;

    static setAppInstance = app => {
        RequestUtilities.app_instance = app;
    };

    static sendGetRequest(endpoint, authorized, config) {
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
            console.log("Error");
            if (error.response.status === 401) {
                console.log("Unauthorized Status Code Found");
                this.app_instance.logout();
            }
            throw error;
        });
    }

    static sendPostRequest(endpoint, data = {}, authorized = false, config) {
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
            console.log("Error");
            if (error.status === 401) {
                console.log("Unauthorized Status Code Found");
                this.app_instance.logout();
            }
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
            console.log("Error");
            if (error.status === 401) {
                console.log("Unauthorized Status Code Found");
                this.app_instance.logout();
            }
            throw error;
        });
    }

};
