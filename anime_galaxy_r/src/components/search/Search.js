import React from 'react';

import "./search.sass";

import RequestUtilities from "./../../util/RequestUtilities";
import CardLayout from "./../cardlayout/CardLayout";

export default class Search extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            results: [],
            searching: true
        };
        if (this.props.search.length >= 3) {
            this.searchAnime();
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps !== this.props) {
            if (this.props.search.length >= 3) {
                this.searchAnime();
            }
        }
    }

    searchAnime = () => {
        this.setState({searching: true});
        RequestUtilities.sendGetRequest(`anime/search?text=${this.props.search}`).then(res => {
            this.setState({results: res.data, searching: false});
            console.log(res.data);
        }).catch(err => {
            this.setState({searching: false});
            console.log("Error searching anime");
            console.log(err.response);
        });
    };

    render() {
        if (this.state.searching) {
            return (
                <div className="search">
                    <div className="gradient-container">
                        <div className="breakpoint-container">
                            <h2 className="bg-title">
                                <div className="pless-title">
                                    <span>Pesquisa</span>
                                </div>
                            </h2>
                            <div className="spacer"/>
                            <div className="loading">
                                <img className="loading-image" src="/images/preloader.svg" alt="Searching"/>
                            </div>
                            <div className="spacer"/>
                        </div>
                    </div>
                </div>
            );
        } else {
            return (
                <div className="search">
                    <div className="gradient-container">
                        <div className="breakpoint-container">
                            <h2 className="bg-title">
                                <div className="pless-title">
                                    <span>Pesquisa</span>
                                </div>
                            </h2>
                            <div className="spacer"/>
                            <div className=".search-results">
                                <CardLayout type={4} items={this.state.results} xl={4} l={3} md={2} sm={2}/>
                            </div>
                            <div className="spacer"/>
                        </div>
                    </div>
                </div>
            );
        }
    }

};