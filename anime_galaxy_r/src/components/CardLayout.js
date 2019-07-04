import React from 'react';
import ReactDOM from "react-dom";

import "./sass/cardlayout.sass";

import HomeEpisodeCard from "./home/HomeEpisodeCard";
import HomeAnimeCard from "./home/HomeAnimeCard";
import AnimeListCard from "./animelist/AnimeListCard";
import SearchAnimeCard from "./search/SearchAnimeCard";

export default class CardLayout extends React.Component {

    componentDidMount() {
        if (this.props.animate) {
            this.updateHeight();
        }
    }

    updateHeight = () => {
        let this_el = ReactDOM.findDOMNode(this);

        if (this_el instanceof HTMLElement) {
            this_el.style.height = this_el.scrollHeight + "px";
            setTimeout(function () {
                this_el.classList.remove("h-0");
                this_el.style.height = "";
                this_el.removeAttribute("style");
            }, 1000);
        }
    };

    render() {
        if (this.props.items != null) {
            let cards = [];
            for (let i = 0; i < this.props.items.length; i++) {
                if (this.props.type === 1) {
                    cards.push(
                        <HomeEpisodeCard className={`card card-sm-${this.props.sm} card-md-${this.props.md} card-l-${this.props.l} card-xl-${this.props.xl}`} item={this.props.items[i]} is_logged_in={this.props.is_logged_in} key={this.props.items[i].id} updateHeight={this.updateHeight}/>
                    );
                } else if (this.props.type === 2) {
                    cards.push(
                        <HomeAnimeCard className={`card card-sm-${this.props.sm} card-md-${this.props.md} card-l-${this.props.l} card-xl-${this.props.xl}`} item={this.props.items[i]} is_logged_in={this.props.is_logged_in} key={this.props.items[i].id} updateHeight={this.updateHeight}/>
                    );
                } else if (this.props.type === 3) {
                    cards.push(
                        <AnimeListCard className={`card card-sm-${this.props.sm} card-md-${this.props.md} card-l-${this.props.l} card-xl-${this.props.xl}`} item={this.props.items[i]} is_logged_in={this.props.is_logged_in} key={this.props.items[i].id} updateHeight={this.updateHeight}/>
                    );
                } else if (this.props.type === 4) {
                    cards.push(
                        <SearchAnimeCard className={`card card-sm-${this.props.sm} card-md-${this.props.md} card-l-${this.props.l} card-xl-${this.props.xl}`} item={this.props.items[i]} is_logged_in={this.props.is_logged_in} key={this.props.items[i].id} updateHeight={this.updateHeight}/>
                    );
                }
            }

            return (
                <div className={`card-layout ${this.props.animate ? "h-0 overflow-hidden" : ""}`} onLoad={this.props.animate ? this.updateHeight : () => {
                }}>
                    {cards}
                </div>
            );
        } else {
            return "";
        }
    }

};