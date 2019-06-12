import React from 'react';
import * as ReactDOM from "react-dom";
import {ToastsStore} from "react-toasts";

import "./episodeoptions.sass";

import RequestUtilities from "../../util/RequestUtilities";

class LikeDislike extends React.Component {

    render() {
        if (this.props.episode.liked === true) {
            return (
                <div className="like-dislike-container">
                    <div className="episode-option chosen" onClick={() => this.props.sendLike(null)}><i className="fas fa-thumbs-up fa-fw"/></div>
                    <div className="episode-option" onClick={() => this.props.sendLike(false)}><i className="fas fa-thumbs-down fa-fw"/></div>
                </div>
            );
        } else if (this.props.episode.liked === false) {
            return (
                <div className="like-dislike-container">
                    <div className="episode-option" onClick={() => this.props.sendLike(true)}><i className="fas fa-thumbs-up fa-fw"/></div>
                    <div className="episode-option chosen" onClick={() => this.props.sendLike(null)}><i className="fas fa-thumbs-down fa-fw"/></div>
                </div>
            );
        } else {
            return (
                <div className="like-dislike-container">
                    <div className="episode-option" onClick={() => this.props.sendLike(true)}><i className="fas fa-thumbs-up fa-fw"/></div>
                    <div className="episode-option" onClick={() => this.props.sendLike(false)}><i className="fas fa-thumbs-down fa-fw"/></div>
                </div>
            );
        }
    }

}

class Report extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            is_open: false
        }
    }

    openReport = () => {
        this.setState({is_open: true});

        let this_el = ReactDOM.findDOMNode(this);
        if (this_el instanceof HTMLElement) {
            let dropdown_el = this_el.querySelector(".option-dropdown-container");
            dropdown_el.classList.add("open");
        }
        console.log("Hey, report, opened");
    };

    closeReport = () => {
        this.setState({is_open: false});

        let this_el = ReactDOM.findDOMNode(this);
        if (this_el instanceof HTMLElement) {
            let dropdown_el = this_el.querySelector(".option-dropdown-container");
            dropdown_el.classList.remove("open");
        }
        console.log("Hey, report, closed");
    };

    report = (type = 0) => {
        if (type === 0) {
            RequestUtilities.sendPostRequest("report/video", {info: this.props.episode.id}, false).then(res => {
                console.log("Video reported");
                ToastsStore.error("Obrigado por reportar este vídeo, investigaremos o problema o mais cedo possível");
            }).catch(res => {
                ToastsStore.error("Ocorreu um erro. Por favor tente mais tarde.");
            });
        } else {
            RequestUtilities.sendPostRequest("report/video/other", {info: this.props.episode.id}, false).then(res => {
                console.log("Video reported");
                ToastsStore.error("Obrigado por reportar este vídeo, investigaremos o problema o mais cedo possível");
            }).catch(res => {
                ToastsStore.error("Ocorreu um erro. Por favor tente mais tarde.");
            });
        }
    };

    render() {
        return (
            <div className="report-container" onMouseLeave={this.closeReport}>
                <div className="option-dropdown-container">
                    <div className="option-dropdown">
                        <div className="episode-option" onClick={this.report}><i className="fas fa-flag fa-fw"/> Video não funciona</div>
                        <div className="episode-option" onClick={() => this.report(1)}><i className="fas fa-flag fa-fw"/> Outro problema</div>
                    </div>
                </div>
                <div className="episode-option" onClick={this.openReport}><i className="fas fa-flag fa-fw"/></div>
            </div>
        );
    }

}

export default class EpisodeOptions extends React.Component {
    render() {
        return (
            <div className="episode-options-container">
                <h1 className="title"><span>{this.props.episode.anime.name} - Episode {this.props.episode.number}</span></h1>
                <div className="options-container">
                    {this.props.is_logged_in ? <LikeDislike episode={this.props.episode} sendLike={this.props.sendLike}/> : ""}
                    <Report episode={this.props.episode}/>
                    <span className="episode-option">{this.props.episode.views} Views</span>
                </div>
            </div>
        );
    }
};