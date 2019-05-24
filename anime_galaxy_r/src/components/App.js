import React from "react";
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';

import './sass/base.sass';

import Home from "./home/Home";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default class extends React.Component {

    hideSidebar() {
        document.querySelector(".sidebar").classList.remove("open");
        document.querySelector(".content-wrapper").classList.remove("dimmed");
    }

    render() {
        return (
            <Router>
                <header className="page-header">
                    <img className="banner-top" src="images/top_banner.png" alt="Banner Natsu" width="100%"/>
                    <Topbar/>
                </header>
                <div className="container w-100">
                    <Sidebar/>
                    <div className="content-wrapper h-100 w-100" onClick={this.hideSidebar}>
                        <div className="h-100 w-100 overlay position-absolute"/>
                        <section className="breakpoint-container content">
                            <Switch>
                                <Route exact path="/" component={Home}/>
                            </Switch>
                        </section>
                    </div>
                </div>
            </Router>
        );
    }

}