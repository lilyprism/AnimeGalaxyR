import React from "react";
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import axios from 'axios';

import './sass/base.sass';

import Home from "./home/Home";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import EpisodePage from "./episodepage/EpisodePage";
import Login from "./login/Login";

export default class App extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            is_logged_in: false
        };
        App.sendGetRequest("login", true, {}).then();
    }

    static isLoggedIn() {
        return this.getAuthToken() !== undefined && this.getAuthToken() !== null;
    }

    static getAuthToken() {
        return localStorage.getItem("anime_galaxy_auth_token");
    }

    static setAuthToken(value) {
        localStorage.setItem("anime_galaxy_auth_token", value);
    }

    static login(username, password) {
        return this.sendPostRequest("auth/login", {username: username, password: password}, false).then(res => {
            console.log(res.data);
            this.setAuthToken(res.data.key);
            return true;
        }).catch(res => {
            return false;
        });
    }

    static logout() {
        this.sendGetRequest("logout", ).then(function (res) {
            console.log(res.data);
        });
    }

    static sendGetRequest(endpoint, authorized, config) {
        if (authorized) {
            if (config !== undefined) {
                if (config.headers === undefined) {
                    config.headers = {};
                }
                config.headers.Authorization = this.getAuthToken();
            } else {
                config = {};
                config.headers = {};
            }
            config.headers.Authorization = this.getAuthToken();
        }

        return axios.get(`${process.env.REACT_APP_API_URL}/${endpoint}`, config).then(function (res) {
            return res;
        });
    }

    static sendPostRequest(endpoint, data = {}, authorized = false, config) {
        if (authorized) {
            if (config !== undefined) {
                if (config.headers === undefined) {
                    config.headers = {};
                }
                config.headers.Authorization = this.getAuthToken();
            } else {
                config = {};
                config.headers = {};
            }
            config.headers.Authorization = this.getAuthToken();
        }

        return axios.post(`${process.env.REACT_APP_API_URL}/${endpoint}`, data, config).then(res => {
            return res;
        });
    }

    static sendPutRequest(endpoint, data, authorized, config) {
        if (authorized) {
            if (config !== undefined) {
                if (config.headers === undefined) {
                    config.headers = {};
                }
                config.headers.Authorization = this.getAuthToken();
            } else {
                config = {};
                config.headers = {};
            }
            config.headers.Authorization = this.getAuthToken();
        }

        return axios.put(`${process.env.REACT_APP_API_URL}/${endpoint}`, data, config).then(res => {
            return res.data;
        });
    }

    static hideSidebar() {
        document.querySelector(".sidebar").classList.remove("open");
        document.querySelector(".content-wrapper").classList.remove("dimmed");

        let sidebar_items = document.querySelectorAll(".sidebar a");

        for (let i = 0; i < sidebar_items.length; i++) {
            sidebar_items[i].tabIndex = "-1";
        }
    }

    //Handles Enter key presses and clicks the target element
    keyToClick(event) {
        if (event.which === 13) {
            event.target.click();
        }
    }

    componentDidMount() {
        this.handleScrollAndResize();
    }

    //This function is responsible for adding the events needed to handle sticky-like behaviours in the website
    handleScrollAndResize() {
        let topbar_el = document.querySelector(".topbar");
        let sidebar_el = document.querySelector(".sidebar");
        let banner_el = document.querySelector(".banner-top");
        let container_el = document.querySelector(".container");
        document.addEventListener("scroll", function (event) {
            if (window.pageYOffset > banner_el.offsetTop + banner_el.clientHeight) {
                topbar_el.classList.add("sticky");
                container_el.classList.add("sticky");
            } else {
                topbar_el.classList.remove("sticky");
                container_el.classList.remove("sticky");
            }
            //Setting the sidebar top style property to the position of the topbar plus the topbar's height
            sidebar_el.style.top = `${topbar_el.getBoundingClientRect().top + topbar_el.scrollHeight}px`;
        });

        window.addEventListener("resize", function (event) {
            sidebar_el.style.top = `${topbar_el.getBoundingClientRect().top + topbar_el.scrollHeight}px`;
        });
    }

    render() {
        return (
            <Router>
                <header className="page-header" onKeyPress={event => this.keyToClick(event)}>
                    <div className="banner-top"/>
                    <Topbar/>
                </header>
                <Sidebar/>
                <div className="container w-100" onKeyPress={event => this.keyToClick(event)}>
                    <div className="content-wrapper h-100 w-100" onClick={App.hideSidebar}>
                        <div className="h-100 w-100 overlay position-absolute"/>
                        <section className="breakpoint-container content">
                            <Switch>
                                <Route exact path="/" component={Home}/>
                                <Route path="/v/:id" component={EpisodePage}/>
                                <Route path="/login" component={Login}/>
                            </Switch>
                        </section>
                    </div>
                </div>
            </Router>
        );
    }

}
