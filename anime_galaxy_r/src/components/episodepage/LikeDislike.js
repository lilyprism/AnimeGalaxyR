import React from "react";

import "./episodeoptions.sass";

export default class LikeDislike extends React.Component {

    handleClick = value => {
        if (!this.props.disabled) {
            this.props.sendLike(value);
        }
    };

    render() {
        if (this.props.episode !== undefined) {
            return (
                <div className={`like-dislike-container ${this.props.className} ${this.props.disabled ? "disabled" : ""}`}>
                    <div className={`episode-option ${this.props.episode.liked === true ? "chosen" : ""}`} onClick={() => this.handleClick(this.props.episode.liked === true ? null : true)}><i className="fas fa-thumbs-up fa-fw"/> {this.props.episode.likes}</div>
                    <div className={`episode-option ${this.props.episode.liked === false ? "chosen" : ""}`} onClick={() => this.handleClick(this.props.episode.liked === false ? null : false)}><i className="fas fa-thumbs-down fa-fw"/> {this.props.episode.dislikes}</div>
                </div>
            );
        } else if (this.props.comment !== undefined) {
            return (
                <div className={`like-dislike-container ${this.props.className} ${this.props.disabled ? "disabled" : ""}`}>
                    <div className={`episode-option ${this.props.comment.liked === true ? "chosen" : ""}`} onClick={() => this.handleClick(this.props.comment.liked === true ? null : true)}><i className="fas fa-thumbs-up fa-fw"/> {this.props.comment.likes}</div>
                    <div className={`episode-option ${this.props.comment.liked === false ? "chosen" : ""}`} onClick={() => this.handleClick(this.props.comment.liked === false ? null : false)}><i className="fas fa-thumbs-down fa-fw"/> {this.props.comment.dislikes}</div>
                </div>
            );
        }
    }

}
