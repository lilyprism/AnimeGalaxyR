import React from 'react';
import moment from 'moment';
import 'moment/locale/pt';

import "./homeepisodecard.sass";

import RequestUtilities from "./../../util/RequestUtilities";
import {Link} from "react-router-dom";

export default class HomeEpisodeCard extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            item: this.props.item,
            isMouseOver: false,
            loadGif: false
        }
    }


    favEpisode = () => {
        let item = {...this.state.item};
        item.favorite = !item.favorite;
        this.setState({item: item});

        RequestUtilities.sendPostRequest("episode/favorite", {episode: this.state.item.id}, true).then(res => {
            console.log("You favorited this episode");
            console.log(res.data);
        }).catch(err => {
            console.log("ERR favoriting the episode!");
            console.log(err.response);
            item.favorite = !item.favorite
            this.setState({item: item});
        });
    };

    addEpisodeToWatchLater = () => {
        let item = {...this.state.item};
        item.watch_later = !item.watch_later;
        this.setState({item: item});

        RequestUtilities.sendPostRequest("episode/watch-later", {episode: this.state.item.id}, true).then(res => {
            console.log("You favorited this episode");
            console.log(res.data);
        }).catch(err => {
            console.log("ERR favoriting the episode!");
            console.log(err.response);
            item.watch_later = !item.watch_later;
            this.setState({item: item});
        });
    };

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.item !== prevProps.item) {
            this.setState({item: this.props.item});
            console.log("Hey");
        }
    }

    render() {
        let time = moment(this.props.item.added);
        time.locale("pt");

        console.log("Hello there");

        return (
            <div className={`${this.props.className} home-episode-card`} onMouseEnter={() => this.setState({loadGif: true, isMouseOver: true})} onMouseLeave={() => this.setState({isMouseOver: false})}>
                <Link to={`/v/${this.props.item.id}`}>
                    <div className="card-image-container">
                        <img className="card-img" src={this.props.item.image} alt="Episode"/>
                        {this.state.loadGif ? <img className={`card-gif${this.state.isMouseOver ? " show" : ""}`} src={this.props.item.gif} alt="Episode Preview"/> : ""}
                    </div>
                </Link>
                <div className="card-body">
                    <div className="card-episode-top-container">
                        <div className="card-episode-number-container">
                            <div className="card-episode-number">
                                {`T${this.state.item.season.number} E${this.state.item.number}`}
                            </div>
                        </div>
                    </div>
                    {
                        this.props.is_logged_in ?
                            <div className="card-episode-options">
                                <span onClick={this.favEpisode}><i className={`card-option fas fa-heart fa-fw ${this.state.item.favorite ? "active" : ""}`}/></span>
                                <span onClick={this.addEpisodeToWatchLater}><i className={`card-option fas fa-clock fa-fw ${this.state.item.watch_later ? "active" : ""}`}/></span>
                            </div>
                            :
                            ""
                    }

                    <div className="filler">
                        <Link to={`/v/${this.props.item.id}`}>
                            <div className="h-100 w-100"/>
                        </Link>
                    </div>
                    <Link to={`/v/${this.props.item.id}`}>
                        <div className="card-episode-info">
                            <div className="card-episode-name">
                                {this.props.item.season.anime.name}
                            </div>
                            <div className="card-episode-time">
                                {time.fromNow()}
                            </div>
                        </div>
                    </Link>
                </div>
                <Link to={`/v/${this.props.item.id}`}>
                    <span className="card-play-icon"><i className="fas fa-play fa-fw"/></span>
                    <div className="card-gradient-overlay"/>
                </Link>
            </div>
        );
    }

};