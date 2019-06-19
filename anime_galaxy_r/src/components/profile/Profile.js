import React from 'react';

import "./profile.sass";
import RequestUtilities from "../../util/RequestUtilities";

class ProfileDescription extends React.Component {

    render() {
        if (!this.props.is_desc_editable) {
            return (
                <p>
                    {this.props.user !== null ? this.props.user.description : "A carregar a descrição do utilizador"}
                </p>
            );
        } else {
            return (
                <textarea className="profile-header-description-textarea">
                    {this.props.user !== null ? this.props.user.description : "A carregar a descrição do utilizador"}
                </textarea>
            );
        }
    }

}

export default class Profile extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            is_desc_editable: false,
            is_img_editable: false,
            user: null
        };
        this.getUser();
    }

    getUser = () => {
        if (this.props.is_logged_in) {
            RequestUtilities.sendGetRequest("auth/user", true).then(res => {
                this.setState({user: res.data});
            });
        }
    };

    toggleEditable = () => {
        this.setState({
            is_desc_editable: !this.state.is_desc_editable,
            is_img_editable: !this.state.is_img_editable
        });
    };

    render() {
        return (
            <div className="profile">
                <div className="profile-header">
                    <div className={`profile-header-img ${this.state.is_img_editable ? "editable" : ""}`}>
                        <img className={`profile-img ${this.state.is_img_editable ? "editable" : ""}`} src={this.state.user !== null ? this.state.user.avatar : "http://via.placeholder.com/500"} alt="User Profile"/>
                    </div>
                    <div className="profile-header-content">
                        <div className="profile-header-content-top">
                            <span className="profile-header-username">{this.state.user !== null ? this.state.user.username : "Username Here"}</span>
                            <span className="profile-settings-btn cursor-pointer" onClick={this.toggleEditable}><i className="fas fa-cog"/></span>
                        </div>
                        <div className="profile-header-content-middle">
                            <div className="profile-header-description">
                                <ProfileDescription is_desc_editable={this.state.is_desc_editable} user={this.state.user}/>
                            </div>
                        </div>
                        <div className="profile-header-content-bottom">
                            <span className="profile-num-anime">Número de animes vistos: 5</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

}