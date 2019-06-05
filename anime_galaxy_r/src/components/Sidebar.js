import React from 'react';

import './sass/sidebar.sass';
import {Link} from "react-router-dom";
import * as ReactDOM from "react-dom";
import App from "./App";
import {ToastsStore} from "react-toasts";
import ModalWindow from "./modalwindow/ModalWindow";

export default class Sidebar extends React.Component {

    componentDidMount() {
        let sidebar_links = ReactDOM.findDOMNode(this).querySelectorAll("a");

        for (let i = 0; i < sidebar_links.length; i++) {
            sidebar_links[i].tabIndex = -1;
        }
    }

    handleNavItemClick() {
        App.hideSidebar();
        App.loseFocus();
    }

    render() {
        let login_logout = "";
        let register = "";
        if (!this.props.is_logged_in) {
            login_logout =
                    <div className="sidebar-item cursor-pointer" onClick={() => {
                        ModalWindow.openModal("login-modal");
                        App.hideSidebar();
                    }}>
                        <i className="fas fa-sign-in-alt fa-fw"/> Entrar
                    </div>;
            register =
                <Link to="/register" onClick={App.handleNavItemClick}>
                    <div className="sidebar-item">
                        <i className="fas fa-user-plus fa-fw"/> Registar
                    </div>
                </Link>;
        } else {
            login_logout =
                <div className="cursor-pointer"
                     onClick={
                         event => {
                             App.hideSidebar();
                             this.props.logout().then(res => {
                                 ToastsStore.success("Saíste da tua conta seu murcão", 3000, "bg-secondary-color");
                             });
                         }
                     }>
                    <div className="sidebar-item">
                        <i className="fas fa-sign-out-alt fa-fw"/> Sair
                    </div>
                </div>;
            register = "";
        }

        return (
            <div className="sidebar sidebar-transition">
                <Link to="/anime" onClick={App.handleNavItemClick}>
                    <div className="sidebar-item">
                        <i className="fas fa-list fa-fw"/> Anime
                    </div>
                </Link>
                <Link to="/top" onClick={App.handleNavItemClick}>
                    <div className="sidebar-item">
                        <i className="fas fa-trophy fa-fw"/> Top
                    </div>
                </Link>
                <Link to="/calendar" onClick={App.handleNavItemClick}>
                    <div className="sidebar-item">
                        <i className="fas fa-calendar-alt fa-fw"/> Calendário
                    </div>
                </Link>
                <Link to="/random" onClick={App.handleNavItemClick}>
                    <div className="sidebar-item">
                        <i className="fas fa-random fa-fw"/> Aleatório
                    </div>
                </Link>
                <div className="login-item-container">
                    {login_logout}
                    {register}
                </div>
            </div>
        );
    }

};