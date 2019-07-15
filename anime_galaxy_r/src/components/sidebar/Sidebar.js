import React from 'react';

import './sass/sidebar.sass';
import {Link, withRouter} from "react-router-dom";
import * as ReactDOM from "react-dom";
import App from "./App";
import {ToastsStore} from "react-toasts";
import ModalWindow from "./modalwindow/ModalWindow";
import RequestUtilities from "../util/RequestUtilities";

class Sidebar extends React.Component {

    componentDidMount() {
        let sidebar_links = ReactDOM.findDOMNode(this).querySelectorAll("a");

        for (let i = 0; i < sidebar_links.length; i++) {
            sidebar_links[i].tabIndex = -1;
        }
    }

    handleNavItemClick = () => {
        App.hideSidebar();
        App.loseFocus();
    };

    goToRandomAnime() {
        RequestUtilities.sendGetRequest("anime/random", false).then(res => {
            this.props.history.push(`/anime/${res.data.id}`);
        }).catch(err => {
            console.log(err.response);
        });
    }

    handleLoginClick = () => {
        this.handleNavItemClick();
        ModalWindow.openModal("login-modal");
    };


    handleLogoutClick = () => {
        App.hideSidebar();
        this.props.logout().then(res => {
            ToastsStore.success("Saíste com sucesso", 3000);
        });
    };

    handleRegisterClick = () => {
        this.handleNavItemClick();
        ModalWindow.openModal("register-modal");
    };

    render() {
        // let login_logout = "";
        // let register = "";
        // if (!this.props.is_logged_in) {
        //     login_logout =
        //         <Link to="/login"
        //               onClick={
        //                   event => {
        //                       event.preventDefault();
        //                       this.handleLoginClick();
        //                   }
        //               }>
        //             <div className="sidebar-item cursor-pointer">
        //                 <i className="fas fa-sign-in-alt fa-fw"/> Entrar
        //             </div>
        //         </Link>;
        //     register =
        //         <Link to="/register"
        //               onClick={
        //                   event => {
        //                       event.preventDefault();
        //                       this.handleRegisterClick();
        //                   }
        //               }>
        //             <div className="sidebar-item">
        //                 <i className="fas fa-user-plus fa-fw"/> Registar
        //             </div>
        //         </Link>;
        // } else {
        //     login_logout =
        //         <Link to="/logout"
        //               onClick={
        //                   event => {
        //                       event.preventDefault();
        //                       this.handleLogoutClick();
        //                   }
        //               }>
        //             <div className="cursor-pointer">
        //                 <div className="sidebar-item">
        //                     <i className="fas fa-sign-out-alt fa-fw"/> Sair
        //                 </div>
        //             </div>
        //         </Link>;
        //     register = "";
        // }

        return (
            <div className="sidebar sidebar-transition">
                <Link to="/" onClick={this.handleNavItemClick} className="d-block-md-down">
                    <div className="sidebar-item">
                        <i className="fas fa-home fa-fw"/> Home
                    </div>
                </Link>
                <Link to="/anime" onClick={this.handleNavItemClick}>
                    <div className="sidebar-item">
                        <i className="fas fa-list fa-fw"/> Anime
                    </div>
                </Link>
                <Link to="/top" onClick={this.handleNavItemClick}>
                    <div className="sidebar-item">
                        <i className="fas fa-trophy fa-fw"/> Top
                    </div>
                </Link>
                <Link to="/calendar" onClick={this.handleNavItemClick}>
                    <div className="sidebar-item">
                        <i className="fas fa-calendar-alt fa-fw"/> Calendário
                    </div>
                </Link>
                <a href={"/random"}
                   onClick={event => {
                       event.preventDefault();
                       this.handleNavItemClick();
                       this.goToRandomAnime();
                   }}
                   onKeyPress={event => {
                       if (event.which === 13) {
                           event.target.click();
                       }
                   }}
                >
                    <div className="sidebar-item">
                        <i className="fas fa-random fa-fw"/> Aleatório
                    </div>
                </a>
                {/*<div className="login-item-container">*/}
                {/*    {this.props.is_logged_in ?*/}
                {/*        <Link to="/profile" onClick={this.handleNavItemClick}>*/}
                {/*            <div className="sidebar-item">*/}
                {/*                <i className="fas fa-address-card fa-fw"/> Profile*/}
                {/*            </div>*/}
                {/*        </Link>*/}
                {/*        :*/}
                {/*        ""*/}
                {/*    }*/}
                {/*    {login_logout}*/}
                {/*    {register}*/}
                {/*</div>*/}
            </div>
        );
    }

}

export default withRouter(Sidebar);