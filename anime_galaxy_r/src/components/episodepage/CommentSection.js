import React from 'react';

class Comment extends React.Component {

    render() {
        let replyLevel = 0;

        if (this.props.comment.replyLevel) {
            replyLevel = Math.min(3, replyLevel);
        }

        return (
            <div className={}>

            </div>
        );
    }

}

export default class CommentSection extends React.Component {

    render() {
        return (
            <div className="comment-section">

            </div>
        );
    }

};