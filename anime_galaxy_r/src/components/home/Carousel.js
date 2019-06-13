import React from 'react';

import './carousel.sass';
import * as ReactDOM from "react-dom";
import {Link} from "react-router-dom";

class CarouselItem extends React.Component {

    render() {
        let desc_html = {__html: this.props.item.description};

        return (
            <div className="carousel-item">
                <Link to={`anime/${this.props.item.id}`}>
                    <div className="carousel-body">
                        <div className="carousel-title">
                            <span>{this.props.item.name}</span>
                        </div>
                        <div className="carousel-desc">
                            <div className="carousel-tags">
                                {this.props.item.genres.map(function (tag, index) {
                                    return <span className="carousel-tag" key={index}>{tag.name}</span>
                                })}
                            </div>
                            <div className="carousel-desc-text" dangerouslySetInnerHTML={desc_html}/>
                        </div>
                    </div>
                    <img className="carousel-img" src={this.props.item.image} alt=""/>
                </Link>
            </div>
        );
    }

}

class CarouselItemEpisode extends React.Component {

    render() {
        return (
            <div className="carousel-item">
                <Link to={`anime/${this.props.item.id}`}>
                    <div className="carousel-body">
                        <div className="carousel-title">
                            <span>{this.props.item.name}</span>
                        </div>
                    </div>
                    <img className="carousel-img" src={this.props.item.image} alt=""/>
                </Link>
            </div>
        );
    }

}

class Carousel extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            moving: false,
            interval: null,
            mouseOver: false
        };
    }

    componentDidMount() {
        this.initCarouselItems();
    }

    initCarouselItems = () => {
        setTimeout(() => {
            let this_el = ReactDOM.findDOMNode(this);

            if (this_el instanceof HTMLElement) {
                console.log(this_el);
                let carousel_items = document.querySelectorAll(".carousel-item");
                console.log(carousel_items);
                for (let i = 0; i < carousel_items.length; i++) {
                    if (i === carousel_items.length - 1) {
                        carousel_items[i].style.order = 1;
                    } else {
                        carousel_items[i].style.order = i + 1;
                    }
                }
            }
            if (this.props.items.length > 6) {
                this.addAutomaticCycle();
            }
        }, 500);


    };

    componentWillUnmount() {
        if (this.state.interval !== null) {
            this.removeAutomaticCycle();
        }
    }

    addAutomaticCycle() {
        let interval = setInterval(() => {
            if (!this.state.mouseOver) {
                this.moveRight();
            }
        }, 4000);
        this.setState({interval: interval});
    }

    removeAutomaticCycle() {
        clearInterval(this.state.interval);
        this.setState({interval: null});
    }

    moveRight = () => {
        if (!this.state.moving) {
            this.setState({moving: true});
            let this_el = ReactDOM.findDOMNode(this);

            if (this_el instanceof HTMLElement) {
                let carousel_items = this_el.querySelectorAll(".carousel-item");
                for (let i = 0; i < carousel_items.length; i++) {
                    carousel_items[i].classList.add("translate-transition", "move-right");
                }
                setTimeout(() => {
                    for (let i = 0; i < carousel_items.length; i++) {
                        if (parseInt(carousel_items[i].style.order) + 1 > carousel_items.length) {
                            carousel_items[i].style.order = "1";
                        } else {
                            carousel_items[i].style.order = parseInt(carousel_items[i].style.order) + 1;
                        }
                        carousel_items[i].classList.remove("translate-transition", "move-right");
                    }
                    this.setState({moving: false});
                }, 300);
            }
        }
    };

    moveLeft = () => {
        if (!this.state.moving) {
            this.setState({moving: true});
            let this_el = ReactDOM.findDOMNode(this);

            if (this_el instanceof HTMLElement) {
                let carousel_items = this_el.querySelectorAll(".carousel-item");
                for (let i = 0; i < carousel_items.length; i++) {
                    carousel_items[i].classList.add("translate-transition", "move-left");
                }
                setTimeout(() => {
                    for (let i = 0; i < carousel_items.length; i++) {
                        if (parseInt(carousel_items[i].style.order) - 1 <= 0) {
                            carousel_items[i].style.order = carousel_items.length;
                        } else {
                            carousel_items[i].style.order = parseInt(carousel_items[i].style.order) - 1;
                        }
                        carousel_items[i].classList.remove("translate-transition", "move-left");
                    }
                    this.setState({moving: false});
                }, 300);
            }
        }
    };

    render() {
        let carousel_items;
        if (this.props.item_type === "CarouselItem") {
            carousel_items = this.props.items.map(function (value, index) {
                return <CarouselItem item={value} index={index + 1} key={index}/>
            });
        } else {
            carousel_items = this.props.items.map(function (value, index) {
                return <CarouselItemEpisode item={value} index={index + 1} key={index}/>
            });
        }
        if (this.props.items.length === 0) {
            return <div>Nada para ver aqui...</div>
        } else if (this.props.items.length > 5) {
            return (
                <div className="carousel"
                     onMouseEnter={event => {
                         this.setState({mouseOver: true});
                     }}
                     onMouseLeave={event => {
                         this.setState({mouseOver: false});
                     }}>
                    <div className="carousel-prev" onClick={this.moveRight}>
                        <i className="fas fa-arrow-left fa-fw"/>
                    </div>
                    <div className="carousel-item-group cyclable">
                        {carousel_items}
                    </div>
                    <div className="carousel-next" onClick={this.moveLeft}>
                        <i className="fas fa-arrow-right fa-fw"/>
                    </div>
                </div>
            );
        } else {
            return (
                <div className="carousel"
                     onMouseEnter={event => {
                         this.setState({mouseOver: true});
                     }}
                     onMouseLeave={event => {
                         this.setState({mouseOver: false});
                     }}>
                    <div className="carousel-item-group">
                        {carousel_items}
                    </div>
                </div>
            );
        }
    }

}

export {
    Carousel,
    CarouselItem,
    CarouselItemEpisode
}