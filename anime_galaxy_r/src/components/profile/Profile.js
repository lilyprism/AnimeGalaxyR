import React from 'react';

import "./profile.sass";

import RequestUtilities from "../../util/RequestUtilities";
import EpisodeHistoryList from "./EpisodeHistoryList";

class ProfileDescription extends React.Component {

    render() {
        if (!this.props.editable) {
            return (
                <p>
                    {this.props.user !== null ? this.props.user.description : "A carregar a descrição do utilizador"}
                </p>
            );
        } else {
            return (
                <textarea className="profile-header-description-textarea" defaultValue={this.props.user !== null ? this.props.user.description : "A carregar a descrição do utilizador"}/>
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
            user: null
        };
        this.getUserInfo();
    }

    getUserInfo = () => {
        if (this.props.is_logged_in) {
            RequestUtilities.sendGetRequest("user/details", true).then(res => {
                this.setState({user: res.data});
                console.log(res.data);
            });
        }
    };

    toggleEditable = () => {
        let editable = this.state.editable;
        editable.is_editable = !editable.is_editable;
        editable.is_desc_editable = !editable.is_desc_editable;
        editable.is_img_editable = !editable.is_img_editable;

        this.setState({
            editable: editable
        });
    };

    render() {
        return (
            <div className="profile">
                <div className="profile-header">
                    <div className={`profile-header-img ${this.state.editable.is_img_editable ? "editable" : ""}`}>
                        <img className={`profile-img ${this.state.editable.is_img_editable ? "editable" : ""}`} src={this.state.user !== null ? this.state.user.user.avatar : "http://via.placeholder.com/500"} alt="User Profile"/>
                    </div>
                    <div className="profile-header-content">
                        <div className="profile-header-content-top">
                            <span className="profile-header-username">{this.state.user !== null ? this.state.user.user.username : "Username Here"}</span>
                            <span className="profile-settings-btn cursor-pointer" onClick={this.toggleEditable}><i className="fas fa-cog"/></span>
                        </div>
                        <div className="profile-header-content-middle">
                            <div className="profile-header-description">
                                <ProfileDescription editable={this.state.editable.is_desc_editable} user={this.state.user}/>
                            </div>
                        </div>
                        <div className="profile-header-content-bottom">
                            <span className="profile-num-anime">Número de animes vistos: 5</span>
                        </div>
                    </div>
                </div>
                <div className="profile-main-content">
                    <h1 className="title"><span>Histórico de Episódios</span></h1>
                    <EpisodeHistoryList items={this.state.user !== null ? this.state.user.last_seen : []}/>
                </div>
            </div>
        );
    }

}