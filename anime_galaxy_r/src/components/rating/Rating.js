import React from 'react';

import "./rating.sass";

export default class Rating extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            rating: this.props.rating != null ? this.props.rating : 0,
            newRating: this.props.newRating,
            mouseOverRating: 0,
            ratingInterval: 100 / this.props.intervals, // 100 / <Number of intervals you want>
            isMouseOver: false,

            starColor: this.props.starColor != null ? this.props.starColor : "#ffd700",
            hoverColor: this.props.hoverColor != null ? this.props.hoverColor : "#ff3200",
            overlapColor: this.props.overlapColor != null ? this.props.overlapColor : "#ff3b44",
            remainderColor: this.props.remainderColor != null ? this.props.remainderColor : "#646464",
        };
    }

    componentWillReceiveProps(nextProps, nextContext) {
        if (nextProps !== this.props) {
            if (this.props.rating !== nextProps.rating) {
                this.setState({
                    rating: nextProps.rating != null ? nextProps.rating : 0,
                });
            }
            if (this.props.newRating !== nextProps.newRating) {
                this.setState({
                    newRating: nextProps.newRating
                });
            }
            if (this.props.intervals !== nextProps.intervals) {
                this.setState({
                    ratingInterval: 100 / nextProps.intervals, // 100 / <Number of intervals you want>
                });
            }

            if (this.props.starColor !== nextProps.starColor) {
                this.setState({
                    starColor: nextProps.starColor != null ? nextProps.starColor : "#ffd700"
                });
            }
            if (this.props.hoverColor !== nextProps.hoverColor) {
                this.setState({
                    hoverColor: nextProps.hoverColor != null ? nextProps.hoverColor : "#ff3200"
                });
            }
            if (this.props.overlapColor !== nextProps.overlapColor) {
                this.setState({
                    overlapColor: nextProps.overlapColor != null ? nextProps.overlapColor : "#ff3b44"
                });
            }
            if (this.props.remainderColor !== nextProps.remainderColor) {
                this.setState({
                    remainderColor: nextProps.remainderColor != null ? nextProps.remainderColor : "#646464"
                });
            }
        }
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

    handleOnClick = () => {
        this.setState({newRating: this.state.mouseOverRating}, () => {
            if (this.props.onClick != null) {
                console.log(this.state.newRating);
                this.props.onClick(this.state.newRating);
            }
        });

    };

    render() {
        let style = {};

        let stars_html = [];
        for (let i = 0; i < this.props.stars; i++) {
            stars_html.push(
                <i className="fas fa-star star" key={i}/>
            );
        }

        if (!this.state.isMouseOver) {
            if (this.state.newRating != null) {
                if (this.state.newRating > this.state.rating) {
                    style.backgroundImage = `linear-gradient(to right, ${this.state.starColor} 0% ${this.state.rating}%, ${this.state.hoverColor} ${this.state.rating}% ${this.state.newRating}%, ${this.state.remainderColor} 0% 100%)`;
                    // style.backgroundImage = `linear-gradient(to right, ${this.state.overlapColor} 0% ${this.state.rating}%, ${this.state.hoverColor} ${this.state.rating}% ${this.state.newRating}%, ${this.state.remainderColor} 0% 100%)`;
                } else {
                    style.backgroundImage = `linear-gradient(to right, ${this.state.overlapColor} 0% ${this.state.newRating}%, ${this.state.starColor} ${this.state.newRating}% ${this.state.rating}%, ${this.state.remainderColor} 0% 100%)`;
                }
            } else {
                style.backgroundImage = `linear-gradient(to right, ${this.state.starColor} 0% ${this.state.rating}%, ${this.state.remainderColor} 0% 100%)`;
            }
        } else {
            if (this.state.mouseOverRating > this.state.rating) {
                // style.backgroundImage = `linear-gradient(to right, ${this.state.starColor} 0% ${this.state.rating}%, ${this.state.hoverColor} ${this.state.rating}% ${this.state.mouseOverRating}%, ${this.state.remainderColor} 0% 100%)`;
                style.backgroundImage = `linear-gradient(to right, ${this.state.overlapColor} 0% ${this.state.rating}%, ${this.state.hoverColor} ${this.state.rating}% ${this.state.mouseOverRating}%, ${this.state.remainderColor} 0% 100%)`;
            } else {
                style.backgroundImage = `linear-gradient(to right, ${this.state.overlapColor} 0% ${this.state.mouseOverRating}%, ${this.state.starColor} ${this.state.mouseOverRating}% ${this.state.rating}%, ${this.state.remainderColor} 0% 100%)`;
            }
        }

        if (this.props.readOnly) {
            return (
                <div className="rating" style={style}>
                    {stars_html}
                </div>
            );
        } else {
            return (
                <div className="rating" style={style} title={this.state.mouseOverRating} onMouseEnter={this.handleMouseEnterRating} onMouseMove={this.handleMouseMoveRating} onMouseLeave={this.handleMouseLeaveRating} onClick={this.handleOnClick} onTouchMove={this.handleMouseMoveRating}>
                    {stars_html}
                </div>
            );
        }
    }

};