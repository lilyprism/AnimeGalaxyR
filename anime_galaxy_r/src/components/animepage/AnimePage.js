import React from 'react';
import AnimeDetails from "./AnimeDetails";
import App from "../App";
import CardLayout from "../CardLayout";
import AnimeEpisodeList from "./AnimeEpisodeList";

export default class AnimePage extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            anime: null
        };
        this.getEpisodeDetails();
    }

    getEpisodeDetails = () => {
        console.log(`anime/${this.props.match.params.id}`);
        App.sendGetRequest(`anime/${this.props.match.params.id}`, false).then(res => {
            this.setState({anime: res.data});
        });
    };

    componentDidMount() {

    }

    render() {
        if (this.state.anime !== null) {
            return (
                <div className="anime-page-container">
                    <div className="spacer"/>
                    <AnimeDetails anime={this.state.anime}/>
                    <AnimeEpisodeList anime={this.state.anime}/>
                </div>
            );
        } else {
            return (
                <div>Nada para ver aqui...</div>
            );
        }
    }

};