import React from 'react';

import './carousel.sass';
import * as ReactDOM from "react-dom";

class CarouselItem extends React.Component {

    render() {
        let desc_html = {__html: this.props.item.description};

        return (
            <div className="carousel-item">
                <div className="carousel-body">
                    <div className="carousel-title">
                        <span>{this.props.item.title}</span>
                    </div>
                    <div className="carousel-desc">
                        <div className="carousel-tags">
                            {this.props.item.tags.map(function (tag, index) {
                                return <span className="carousel-tag" key={index}>{tag}</span>
                            })}
                        </div>
                        <div className="carousel-desc-text" dangerouslySetInnerHTML={desc_html}/>
                    </div>
                </div>
                <img className="carousel-img" src={`http://via.placeholder.com/298x428?text=${this.props.index}`} alt=""/>
            </div>
        );
    }

}

class CarouselItemEpisode extends React.Component {

    render() {
        return (
            <div className="carousel-item">
                <div className="carousel-body">
                    <div className="carousel-title">
                        <span>{this.props.item.title}</span>
                    </div>
                </div>
                <img className="carousel-img" src={`http://via.placeholder.com/298x428?text=${this.props.index}`} alt=""/>
            </div>
        );
    }

}

class Carousel extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            moving: false,
            items: [
                {
                    title: "Konosuba",
                    description: "<p>After dying a laughable and pathetic death on his way back from buying a game, high school student and recluse Kazuma Satou finds himself sitting before a beautiful but obnoxious goddess named <strong>Aqua</strong>. She provides the NEET with two options: continue on to heaven or reincarnate in every gamer&#39;s dream&mdash;a real fantasy world! Choosing to start a new life, Kazuma is quickly tasked with defeating a Demon King who is terrorizing villages. But before he goes, he can choose one item of any kind to aid him in his quest, and the future hero selects Aqua. But Kazuma has made a grave mistake&mdash;<strong>Aqua </strong>is completely useless!<br /><br />Unfortunately, their troubles don&#39;t end here; it turns out that living in such a world is far different from how it plays out in a game. Instead of going on a thrilling adventure, the duo must first work to pay for their living expenses. Indeed, their misfortunes have only just begun!</p>",
                    tags: [
                        "Shounen",
                        "Ecchi",
                        "Magic",
                        "Fantasy"
                    ]
                },
                {
                    title: "Fairy Tail",
                    description: "An anime about a fire wizard looking for his dragon father",
                    tags: [
                        "Shounen",
                        "Ecchi",
                        "Magic",
                        "Fantasy"
                    ]
                },
                {
                    title: "Fairy Tail",
                    description: "An anime about a fire wizard looking for his dragon father",
                    tags: [
                        "Shounen",
                        "Ecchi",
                        "Magic",
                        "Fantasy"
                    ]
                },
                {
                    title: "Fairy Tail",
                    description: "An anime about a fire wizard looking for his dragon father (yes, it's an actual dragon) but ends up finding a stupid annoying bitch called Lucy",
                    tags: [
                        "Shounen",
                        "Ecchi",
                        "Magic",
                        "Fantasy"
                    ]
                },
                {
                    title: "Fairy Tail",
                    description: "An anime about a fire wizard looking for his dragon father",
                    tags: [
                        "Shounen",
                        "Ecchi",
                        "Magic",
                        "Fantasy"
                    ]
                },
                {
                    title: "Fairy Tail",
                    description: "An anime about a fire wizard looking for his dragon father",
                    tags: [
                        "Shounen",
                        "Ecchi",
                        "Magic",
                        "Fantasy"
                    ]
                },
                {
                    title: "Fairy Tail",
                    description: "An anime about a fire wizard looking for his dragon father",
                    tags: [
                        "Shounen",
                        "Ecchi",
                        "Magic",
                        "Fantasy"
                    ]
                },
                {
                    title: "Fairy Tail",
                    description: "An anime about a fire wizard looking for his dragon father",
                    tags: [
                        "Shounen",
                        "Ecchi",
                        "Magic",
                        "Fantasy"
                    ]
                },
            ],
            interval: null,
            mouseOver: false
        };
    }

    componentDidMount() {
        let this_el = ReactDOM.findDOMNode(this);

        if (this_el instanceof HTMLElement) {
            let carousel_items = this_el.querySelectorAll(".carousel-item");
            for (let i = 0; i < carousel_items.length; i++) {
                if (i === carousel_items.length - 1) {
                    carousel_items[i].style.order = 1;
                } else {
                    carousel_items[i].style.order = i + 2;
                }
            }
        }

        //this.addAutomaticCycle();
    }

    componentWillUnmount() {
        if (this.state.integrity !== null) {
            this.removeAutomaticCycle();
        }
    }

    addAutomaticCycle() {
        let interval = setInterval(() => {
            if (!this.state.mouseOver) {
                this.moveLeft();
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
                <div className="carousel-item-group">
                    {/*{this.state.items.map(function (value, index) {*/}
                    {/*    return <CarouselItem item={value} index={index + 1} key={index}/>*/}
                    {/*})}*/}
                    {this.props.children}
                </div>
                <div className="carousel-next" onClick={this.moveLeft}>
                    <i className="fas fa-arrow-right fa-fw"/>
                </div>
            </div>
        );
    }

}

export {
    Carousel,
    CarouselItem,
    CarouselItemEpisode
}