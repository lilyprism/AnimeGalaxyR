import React from 'react';
import RequestUtilities from "../../util/RequestUtilities";

export default class Rating extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            rating: this.props.rating != null ? this.props.rating : 0,
            ratingInterval: 100 / this.props.intervals, // 100 / <Number of intervals you want>
            mouseOverRating: 0,
            isMouseOver: false,

            starColor: this.props.starColor != null ? this.props.starColor : "#ffd700",
            hoverColor: this.props.hoverColor != null ? this.props.hoverColor : "#ff3200",
            overlapColor: this.props.overlapColor != null ? this.props.overlapColor : "#ff3b44",
            remainderColor: this.props.remainderColor != null ? this.props.remainderColor : "#646464",
        };
    }

    handleMouseMoveRating = event => {
        let boundingRect = event.currentTarget.getBoundingClientRect();
        let relativeX = event.clientX - boundingRect.left;
        let relativePercentage = Math.round(Math.ceil(relativeX / (event.currentTarget.scrollWidth - 1) * 100 / this.state.ratingInterval) * this.state.ratingInterval);
        this.setState({mouseOverRating: relativePercentage});
    };

    handleMouseEnterRating = event => {
        this.setState({isMouseOver: true});
    };

    handleMouseLeaveRating = event => {
        this.setState({isMouseOver: false});
    };

    // handleClickRating = () => {
    //     let = {...this.state};
    //    .rating = this.state.mouseOverRating;
    //     this.setState(:});
    //     RequestUtilities.sendPutRequest(/rating", {rating: this.state.mouseOverRating}, true).then(res => {
    //         console.log("Hello there");
    //     }).catch(err => {
    //         console.log(err.response);
    //     });
    // };


    render() {
        let style = {};

        let stars_html = [];
        for (let i = 0; i < this.props.stars; i++) {
            stars_html.push(
                <i className="fas fa-star star" key={i}/>
            );
        }

        if (!this.state.isMouseOver) {
            console.log("0");
            style.backgroundImage = `linear-gradient(to right, ${this.state.starColor} 0% ${this.state.rating}%, ${this.state.remainderColor} 0% 100%)`;
            console.log(style);
        } else {
            console.log("1");
            if (this.state.mouseOverRating > this.state.rating) {
                style.backgroundImage = `linear-gradient(to right, ${this.state.overlapColor} 0% ${this.state.rating}%, ${this.state.hoverColor} ${this.state.rating}% ${this.state.mouseOverRating}%, ${this.state.remainderColor} 0% 100%)`;
            } else {
                style.backgroundImage = `linear-gradient(to right, ${this.state.overlapColor} 0% ${this.state.mouseOverRating}%, ${this.state.starColor} ${this.state.mouseOverRating}% ${this.state.rating}%, ${this.state.remainderColor} 0% 100%)`;
            }
        }

        return (
            <div className="rating" style={style} title={this.state.mouseOverRating} onMouseEnter={this.handleMouseEnterRating} onMouseMove={this.handleMouseMoveRating} onMouseLeave={this.handleMouseLeaveRating} onClick={this.props.onClick} onTouchMove={this.handleMouseMoveRating}>
                {stars_html}
            </div>
        );
    }

};