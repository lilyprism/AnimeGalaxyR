import React from 'react';

import "./profile.sass";

import RequestUtilities from "../../util/RequestUtilities";
import EpisodeHistoryList from "./EpisodeHistoryList";
import UserAnimeStats from "./UserAnimeStats";
import AnimeList from "./AnimeList";
import WatchingList from "./WatchingList";

class ProfileDescription extends React.Component {

    render() {
        if (!this.props.editable) {
            return (
                <div className="profile-header-description">
                    <p>
                        {this.props.user !== null ? this.props.user.user.description : "A carregar a descrição do utilizador"}
                    </p>
                </div>
            );
        } else {
            return (
                <div className="profile-header-description">
                    <textarea className="profile-header-description-textarea" defaultValue={this.props.user !== null ? this.props.user.user.description : "A carregar a descrição do utilizador"}/>
                </div>
            );
        }
    }

}

export default class Profile extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            editable: {
                is_editable: false,
                is_desc_editable: false,
                is_img_editable: false,
            },
            userInfo: null
        };
        this.getUserInfo();
    }

    getUserInfo = () => {
        if (this.props.self) {
            if (this.props.is_logged_in) {
                RequestUtilities.sendGetRequest("user/details", true).then(res => {
                    this.setState({userInfo: res.data});
                    console.log(res.data);
                });
            }
        } else {
            RequestUtilities.sendGetRequest(`user/details/${this.props.match.params.id}`, false).then(res => {
                this.setState({userInfo: res.data});
                console.log(res.data);
            });
        }
    };

    toggleEditable = () => {
        if (this.props.self) {
            let editable = this.state.editable;
            editable.is_editable = !editable.is_editable;
            editable.is_desc_editable = !editable.is_desc_editable;
            editable.is_img_editable = !editable.is_img_editable;

            this.setState({
                editable: editable
            });
        }
    };

    render() {
        return (
            <div className="profile">
                <div className="profile-header">
                    <div className={`profile-header-img ${this.state.editable.is_img_editable ? "editable" : ""}`}>
                        <img className={`profile-img ${this.state.editable.is_img_editable ? "editable" : ""}`} src={this.state.userInfo !== null ? this.state.userInfo.user.avatar : "http://via.placeholder.com/500"} alt="User Profile"/>
                    </div>
                    <div className="profile-header-content">
                        <div className="profile-header-content-top">
                            <span className="profile-header-username">{this.state.userInfo !== null ? this.state.userInfo.user.username : "Username Here"}</span>
                            {this.props.self ? <span className="profile-settings-btn cursor-pointer" onClick={this.toggleEditable}><i className="fas fa-cog"/></span> : ""}
                        </div>
                        <div className="profile-header-content-middle">
                            <ProfileDescription editable={this.state.editable.is_desc_editable} user={this.state.userInfo}/>
                            <UserAnimeStats stats={{anime: this.state.userInfo !== null ? this.state.userInfo.animes_finished : 0, episodes: this.state.userInfo !== null ? this.state.userInfo.episodes_watched : 0, time: this.state.userInfo !== null ? this.state.userInfo.time_watched : 0}}/>
                        </div>
                    </div>
                </div>
                <div className="profile-main-content">
                    <h1 className="title"><span>Histórico de Episódios</span></h1>
                    <EpisodeHistoryList items={this.state.userInfo !== null ? this.state.userInfo.last_seen : []}/>
                    <h1 className="title"><span>Animes Vistos</span></h1>
                    <AnimeList items={this.state.userInfo !== null ? this.state.userInfo.complete : []}/>
                    <h1 className="title"><span>Animes em Progresso</span></h1>
                    <WatchingList items={this.state.userInfo !== null ? this.state.userInfo.watching : []}/>
                </div>
            </div>
        );
    }

}