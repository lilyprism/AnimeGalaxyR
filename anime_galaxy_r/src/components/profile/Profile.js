import React from 'react';

import "./profile.sass";

export default class Profile extends React.Component {

    render() {
        return (
            <div className="profile">
                <div className="profile-header">
                    <div className="profile-header-img">
                        <img src={this.props.user !== null ? this.props.user.avatar : "http://via.placeholder.com/500"} alt="User Profile"/>
                    </div>
                    <div className="profile-header-content">
                        <div className="profile-header-content-top">
                            <span className="profile-header-username">{this.props.user !== null ? this.props.user.username : "Username Here"}</span>
                            <span className="profile-settings-btn cursor-pointer"><i className="fas fa-cog"/></span>
                        </div>
                        <div className="profile-header-content-middle">
                            <div className="profile-header-description">
                                <p>
                                    This is the default description for a new user on the platform
                                </p>
                                <p>
                                    This way, I can actually check what the profile page would look likewith an actual user.
                                </p>
                                <p>
                                    What I mean is, this is placeholder information to facilitate
                                    the testing phase of the page development.
                                </p>
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