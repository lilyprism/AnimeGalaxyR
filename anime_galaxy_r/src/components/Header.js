import React from 'react';
import Topbar from "./Topbar";
import './sass/header.sass';

export default class Header extends React.Component {
    
    render() {
        return (
            <header>
                <img className="banner-top" src="images/top_banner.png" alt="Banner Natsu" width="100%"/>
                <Topbar/>
            </header>
        );
    }

};