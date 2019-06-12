import React from 'react';
import * as ReactDOM from "react-dom";
import {ToastsStore} from "react-toasts";
import moment from 'moment';
import 'moment/locale/pt';

import "./commentsection.sass";
import RequestUtilities from "../../util/RequestUtilities";

class CommentActions extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            reply: ""
        }
    }

    handleReplyClick = event => {
        let this_el = ReactDOM.findDOMNode(this);

        if (this_el instanceof HTMLElement) {
            this_el.querySelector(".comment-reply-form").classList.toggle("show");
            if (event.target.innerHTML === "Reply") {
                event.target.innerHTML = "Cancel";
            } else {
                event.target.innerHTML = "Reply"
            }
        }
    };

    sendComment(text) {
        RequestUtilities.sendPostRequest(`episode/${this.props.episode.id}/comment`, {text: text, parent: this.props.comment.id}, true).then(res => {
            ToastsStore.success("Comentário Enviado");
            this.props.getComments();

            let this_el = ReactDOM.findDOMNode(this);

            if (this_el instanceof HTMLElement) {
                this_el.querySelector(".comment-reply-textarea").value = "";
                this_el.querySelector(".comment-reply-form").classList.toggle("show");
            }
        });
    }

    render() {
        return (
            <div className="comment-actions">
                <div className="comment-options">
                    <span className="comment-option cursor-pointer" onClick={this.handleReplyClick}>Reply</span>
                </div>
                <div className="comment-reply-form">
                    <textarea className="comment-reply-textarea" onChange={event => this.setState({reply: event.target.value})}/>
                    <span className="comment-option cursor-pointer mini-btn" onClick={() => this.sendComment(this.state.reply)}>Send</span>
                </div>
            </div>
        );
    }

}

class Comment extends React.Component {

    render() {
        let time = moment(this.props.comment.date);
        time.locale("pt");

        return (
            <div className={`comment comment-lvl-${Math.min(this.props.comment.level, 3)}`}>
                <div className="comment-body">
                    <img className="comment-user-avatar" src={this.props.comment.user.avatar} width="75" height="75" alt=""/>
                    <div className="comment-right-container">
                        <div className="comment-user">
                            <span className="comment-user-name">{this.props.comment.user.username}</span> - <span className="comment-time">{time.fromNow()}</span>
                        </div>
                        <div className="comment-text">
                            {this.props.comment.text}
                        </div>
                        {
                            this.props.is_logged_in ?
                                <CommentActions getComments={this.props.getComments} episode={this.props.episode} comment={this.props.comment}/>
                                :
                                ""
                        }
                    </div>
                </div>
            </div>
        );
    }

}

export default class CommentSection extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            new_comment: ""
        }
    }

    parseComments = (comments) => {
        let comment_html = [];

        for (let i = 0; i < comments.length; i++) {
            comment_html.push(<Comment key={comments[i].id} getComments={this.props.getComments} episode={this.props.episode} comment={comments[i]} is_logged_in={this.props.is_logged_in}/>);

            if (comments[i].replies !== undefined) {
                comment_html = comment_html.concat(this.parseComments(comments[i].replies));
            }
        }

        return comment_html;
    };

    sendNewComment = text => {
        RequestUtilities.sendPostRequest(`episode/${this.props.episode.id}/comment`, {text: text, parent: null}, true).then(res => {
            console.log("Hey");
            ToastsStore.success("Comentário Enviado");
            this.props.getComments();

            let this_el = ReactDOM.findDOMNode(this);

            if (this_el instanceof HTMLElement) {
                this_el.querySelector(".new-comment-textarea").value = "";
            }
        });
    };

    render() {
        let comment_html = this.parseComments(this.props.comments);

        return (
            <div className="comment-section">
                <h1 className="title"><span>Comentários</span></h1>
                {
                    this.props.is_logged_in ?
                        <div className="new-comment-form">
                            <textarea className="new-comment-textarea" onChange={event => this.setState({new_comment: event.target.value})}/>
                            <span className="cursor-pointer mini-btn" onClick={() => this.sendNewComment(this.state.new_comment)}>Send</span>
                        </div>
                        :
                        ""
                }
                {comment_html}
            </div>
        );
    }

};