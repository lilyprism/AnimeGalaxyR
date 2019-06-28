import React from 'react';
import moment from 'moment';
import 'moment/locale/pt';

import "./homeanimecard.sass";

export default class HomeAnimeCard extends React.Component {

    render() {

        return (
            <div className={`${this.props.className} home-anime-card`}>
                <div className="card-image-container">
                    <img className="card-img" src={this.props.item.image} alt="Episode"/>
                    <div className="card-hover-desc">
                        <div className="anime-genres">
                            {/*{this.props.item.genres.map((genre, index) => {*/}
                            {/*    return (*/}
                            {/*        <span>genre.</span>*/}
                            {/*    )*/}
                            {/*})}*/}
                        </div>
                        <div className="anime-desc">
                            
                        </div>
                    </div>
                </div>
                <div className="card-body">
                    <div className="card-anime-info">
                        <div className="card-anime-name">
                            {this.props.item.name}
                        </div>
                        <div className="card-anime-views">
                            <i className={`card-option fas fa-eye fa-fw`}/> 1337420
                        </div>
                    </div>
                </div>
                <div className="card-gradient-overlay"/>
            </div>
        );
    }

};