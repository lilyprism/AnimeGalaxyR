import React from "react";
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import axios from 'axios';
import {ToastsContainer, ToastsStore} from "react-toasts";

import './sass/base.sass';

import Home from "./home/Home";
import Sidebar from "./Sidebar";
import Topbar from "./topbar/Topbar";
import EpisodePage from "./episodepage/EpisodePage";
import AnimePage from "./animepage/AnimePage";
import LoginModal from "./login/LoginModal";
import ModalWindow from "./modalwindow/ModalWindow";

export default class App extends React.Component {

    app = this;

    constructor(props) {
        super(props);

        this.state = {
            is_logged_in: App.isLoggedIn()
        };
    }

    static isLoggedIn() {
        return this.getAuthToken() !== undefined && this.getAuthToken() !== null && this.getAuthToken() !== "Token ";
    }

    static getAuthToken() {
        let token = localStorage.getItem("anime_galaxy_auth_token");

        if (token !== null) {
            return `Token ${localStorage.getItem("anime_galaxy_auth_token")}`;
        } else {
            return null;
        }
    }

    static setAuthToken(value) {
        localStorage.setItem("anime_galaxy_auth_token", value);
    }

    static removeAuthToken() {
        localStorage.removeItem("anime_galaxy_auth_token");
    }

    login = (username, password) => {
        return App.sendPostRequest("auth/login", {username: username, password: password}, false).then(res => {
            console.log(res.data);
            App.setAuthToken(res.data.key);
            this.setState({is_logged_in: true});
            return App.isLoggedIn();
        }).catch(res => {
            this.setState({is_logged_in: false});
            return App.isLoggedIn();
        });
    };

    logout = () => {
        return App.sendPostRequest("auth/logout", {}, true).then(res => {
            App.removeAuthToken();
            this.setState({is_logged_in: false});
            return App.isLoggedIn();
        }).catch(res => {
            App.removeAuthToken();
            this.setState({is_logged_in: false});
            return App.isLoggedIn();
        });
    };

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

    static loseFocus() {
        document.activeElement.blur();
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
                <Sidebar is_logged_in={this.state.is_logged_in} logout={this.logout}/>
                <div className="container w-100" onKeyPress={event => this.keyToClick(event)}>
                    <div className="content-wrapper h-100 w-100" onClick={App.hideSidebar}>
                        <div className="h-100 w-100 overlay position-absolute"/>
                        <section className="breakpoint-container content">
                            <Switch>
                                <Route exact path="/" component={Home}/>
                                <Route path="/v/:id" render={
                                    props =>
                                        <EpisodePage {...props} is_logged_in={this.state.is_logged_in}/>
                                }/>
                                <Route exact path="/anime/:id" render={
                                    props =>
                                        <AnimePage {...props}/>
                                }/>
                                {/*<Route path="/login" render={*/}
                                {/*    props =>*/}
                                {/*        <Login {...props} login={this.login} is_logged_in={this.state.is_logged_in}/>*/}
                                {/*}/>*/}
                            </Switch>
                        </section>
                    </div>
                </div>
                <ToastsContainer store={ToastsStore}/>
                {!this.state.is_logged_in ? <LoginModal element_id={"login-modal"} login={this.login}/> : ""}
            </Router>
        );
    }

}
