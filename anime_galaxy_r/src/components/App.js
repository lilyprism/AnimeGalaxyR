import React from "react";
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';

import Header from "./Header";

import './sass/base.sass';

export default class extends React.Component {

    render() {
        return (
            <div>
                <Header/>
                <div></div>
            </div>
        );
    }

}