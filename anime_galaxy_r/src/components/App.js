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

        let sidebar_items = document.querySelectorAll(".sidebar a");

        for (let i = 0; i < sidebar_items.length; i++) {
            sidebar_items[i].tabIndex = "-1";
            console.log("Hello there General Kenobi!");
        }
    }

    keyToClick(event) {
        if (event.which === 13) {
            event.target.click();
        }
    }

    componentDidMount() {
        this.handleScroll();
    }

    handleScroll() {
        document.addEventListener("scroll", function (event) {
            let topbar_el = document.querySelector(".topbar");
            let sidebar_el = document.querySelector(".sidebar");
            let banner_el = document.querySelector(".banner-top");
            let container_el = document.querySelector(".container");
            if (window.pageYOffset > banner_el.offsetTop + banner_el.clientHeight) {
                topbar_el.classList.add("sticky");
                sidebar_el.classList.add("sticky");
                container_el.classList.add("sticky");
            } else {
                topbar_el.classList.remove("sticky");
                sidebar_el.classList.remove("sticky");
                container_el.classList.remove("sticky");
            }
        });
    }

    render() {
        return (
            <Router>
                <header className="page-header" onKeyPress={event => this.keyToClick(event)}>
                    <img className="banner-top" src="images/top_banner.png" alt="Banner Natsu" width="100%"/>
                    <Topbar/>
                </header>
                <div className="container w-100" onKeyPress={event => this.keyToClick(event)}>
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
