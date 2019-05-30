import React from 'react';
import axios from 'axios';

import CardLayout from "./CardLayout";
import {Carousel} from "./Carousel";
import {CarouselItem} from "./Carousel";
import {CarouselItemEpisode} from "./Carousel";

export default class Home extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            latest_episodes: []
        };
        this.getLatestEpisodes();
        console.log("Constructor");
    }

    getLatestEpisodes(){
        console.log(`${process.env.REACT_APP_API_URL}/episodes`);
        axios.get(`${process.env.REACT_APP_API_URL}/episodes`).then(res => {
            this.setState({
                latest_episodes: res.data
            });
        }).catch(res => {
            console.log("Error getting the episode");
            setTimeout(() => this.getLatestEpisodes(), 2000);
        });
    }

    componentDidMount() {

    }

    render() {
        return (
            <div>
                <h1 className="title"><span><i className="fas fa-newspaper"/>  Episódios:</span></h1>
                <CardLayout items={this.state.latest_episodes}/>
                <h1 className="title"><span><i className="fas fa-newspaper"/>  Últimos Animes:</span></h1>
                <Carousel>
                    <CarouselItem item={{
                        title: "Konosuba",
                        description: "<p>After dying a laughable and pathetic death on his way back from buying a game, high school student and recluse Kazuma Satou finds himself sitting before a beautiful but obnoxious goddess named <strong>Aqua</strong>. She provides the NEET with two options: continue on to heaven or reincarnate in every gamer&#39;s dream&mdash;a real fantasy world! Choosing to start a new life, Kazuma is quickly tasked with defeating a Demon King who is terrorizing villages. But before he goes, he can choose one item of any kind to aid him in his quest, and the future hero selects Aqua. But Kazuma has made a grave mistake&mdash;<strong>Aqua </strong>is completely useless!<br /><br />Unfortunately, their troubles don&#39;t end here; it turns out that living in such a world is far different from how it plays out in a game. Instead of going on a thrilling adventure, the duo must first work to pay for their living expenses. Indeed, their misfortunes have only just begun!</p>",
                        tags: [
                            "Shounen",
                            "Ecchi",
                            "Magic",
                            "Fantasy"
                        ]
                    }}/>
                    <CarouselItem item={{
                        title: "Konosuba",
                        description: "<p>After dying a laughable and pathetic death on his way back from buying a game, high school student and recluse Kazuma Satou finds himself sitting before a beautiful but obnoxious goddess named <strong>Aqua</strong>. She provides the NEET with two options: continue on to heaven or reincarnate in every gamer&#39;s dream&mdash;a real fantasy world! Choosing to start a new life, Kazuma is quickly tasked with defeating a Demon King who is terrorizing villages. But before he goes, he can choose one item of any kind to aid him in his quest, and the future hero selects Aqua. But Kazuma has made a grave mistake&mdash;<strong>Aqua </strong>is completely useless!<br /><br />Unfortunately, their troubles don&#39;t end here; it turns out that living in such a world is far different from how it plays out in a game. Instead of going on a thrilling adventure, the duo must first work to pay for their living expenses. Indeed, their misfortunes have only just begun!</p>",
                        tags: [
                            "Shounen",
                            "Ecchi",
                            "Magic",
                            "Fantasy"
                        ]
                    }}/>
                    <CarouselItem item={{
                        title: "Konosuba",
                        description: "<p>After dying a laughable and pathetic death on his way back from buying a game, high school student and recluse Kazuma Satou finds himself sitting before a beautiful but obnoxious goddess named <strong>Aqua</strong>. She provides the NEET with two options: continue on to heaven or reincarnate in every gamer&#39;s dream&mdash;a real fantasy world! Choosing to start a new life, Kazuma is quickly tasked with defeating a Demon King who is terrorizing villages. But before he goes, he can choose one item of any kind to aid him in his quest, and the future hero selects Aqua. But Kazuma has made a grave mistake&mdash;<strong>Aqua </strong>is completely useless!<br /><br />Unfortunately, their troubles don&#39;t end here; it turns out that living in such a world is far different from how it plays out in a game. Instead of going on a thrilling adventure, the duo must first work to pay for their living expenses. Indeed, their misfortunes have only just begun!</p>",
                        tags: [
                            "Shounen",
                            "Ecchi",
                            "Magic",
                            "Fantasy"
                        ]
                    }}/>
                    <CarouselItem item={{
                        title: "Konosuba",
                        description: "<p>After dying a laughable and pathetic death on his way back from buying a game, high school student and recluse Kazuma Satou finds himself sitting before a beautiful but obnoxious goddess named <strong>Aqua</strong>. She provides the NEET with two options: continue on to heaven or reincarnate in every gamer&#39;s dream&mdash;a real fantasy world! Choosing to start a new life, Kazuma is quickly tasked with defeating a Demon King who is terrorizing villages. But before he goes, he can choose one item of any kind to aid him in his quest, and the future hero selects Aqua. But Kazuma has made a grave mistake&mdash;<strong>Aqua </strong>is completely useless!<br /><br />Unfortunately, their troubles don&#39;t end here; it turns out that living in such a world is far different from how it plays out in a game. Instead of going on a thrilling adventure, the duo must first work to pay for their living expenses. Indeed, their misfortunes have only just begun!</p>",
                        tags: [
                            "Shounen",
                            "Ecchi",
                            "Magic",
                            "Fantasy"
                        ]
                    }}/>
                    <CarouselItem item={{
                        title: "Konosuba",
                        description: "<p>After dying a laughable and pathetic death on his way back from buying a game, high school student and recluse Kazuma Satou finds himself sitting before a beautiful but obnoxious goddess named <strong>Aqua</strong>. She provides the NEET with two options: continue on to heaven or reincarnate in every gamer&#39;s dream&mdash;a real fantasy world! Choosing to start a new life, Kazuma is quickly tasked with defeating a Demon King who is terrorizing villages. But before he goes, he can choose one item of any kind to aid him in his quest, and the future hero selects Aqua. But Kazuma has made a grave mistake&mdash;<strong>Aqua </strong>is completely useless!<br /><br />Unfortunately, their troubles don&#39;t end here; it turns out that living in such a world is far different from how it plays out in a game. Instead of going on a thrilling adventure, the duo must first work to pay for their living expenses. Indeed, their misfortunes have only just begun!</p>",
                        tags: [
                            "Shounen",
                            "Ecchi",
                            "Magic",
                            "Fantasy"
                        ]
                    }}/>
                    <CarouselItem item={{
                        title: "Konosuba",
                        description: "<p>After dying a laughable and pathetic death on his way back from buying a game, high school student and recluse Kazuma Satou finds himself sitting before a beautiful but obnoxious goddess named <strong>Aqua</strong>. She provides the NEET with two options: continue on to heaven or reincarnate in every gamer&#39;s dream&mdash;a real fantasy world! Choosing to start a new life, Kazuma is quickly tasked with defeating a Demon King who is terrorizing villages. But before he goes, he can choose one item of any kind to aid him in his quest, and the future hero selects Aqua. But Kazuma has made a grave mistake&mdash;<strong>Aqua </strong>is completely useless!<br /><br />Unfortunately, their troubles don&#39;t end here; it turns out that living in such a world is far different from how it plays out in a game. Instead of going on a thrilling adventure, the duo must first work to pay for their living expenses. Indeed, their misfortunes have only just begun!</p>",
                        tags: [
                            "Shounen",
                            "Ecchi",
                            "Magic",
                            "Fantasy"
                        ]
                    }}/>
                    <CarouselItem item={{
                        title: "Konosuba",
                        description: "<p>After dying a laughable and pathetic death on his way back from buying a game, high school student and recluse Kazuma Satou finds himself sitting before a beautiful but obnoxious goddess named <strong>Aqua</strong>. She provides the NEET with two options: continue on to heaven or reincarnate in every gamer&#39;s dream&mdash;a real fantasy world! Choosing to start a new life, Kazuma is quickly tasked with defeating a Demon King who is terrorizing villages. But before he goes, he can choose one item of any kind to aid him in his quest, and the future hero selects Aqua. But Kazuma has made a grave mistake&mdash;<strong>Aqua </strong>is completely useless!<br /><br />Unfortunately, their troubles don&#39;t end here; it turns out that living in such a world is far different from how it plays out in a game. Instead of going on a thrilling adventure, the duo must first work to pay for their living expenses. Indeed, their misfortunes have only just begun!</p>",
                        tags: [
                            "Shounen",
                            "Ecchi",
                            "Magic",
                            "Fantasy"
                        ]
                    }}/>
                </Carousel>
                <h1 className="title"><span><i className="fas fa-newspaper"/>  Assistidos No Momento:</span></h1>
                <Carousel>
                    <CarouselItemEpisode item={{
                        title: "Konosuba"
                    }}/>
                    <CarouselItemEpisode item={{
                        title: "Konosuba"
                    }}/>
                    <CarouselItemEpisode item={{
                        title: "Konosuba"
                    }}/>
                    <CarouselItemEpisode item={{
                        title: "Konosuba"
                    }}/>
                    <CarouselItemEpisode item={{
                        title: "Konosuba"
                    }}/>
                    <CarouselItemEpisode item={{
                        title: "Konosuba"
                    }}/>
                    <CarouselItemEpisode item={{
                        title: "Konosuba"
                    }}/>
                    <CarouselItemEpisode item={{
                        title: "Konosuba"
                    }}/>
                </Carousel>
            </div>
        );
    }

};