import React from 'react';
import CardLayout from "../CardLayout";
import App from "../App";

import "./animeepisodelist.sass";

export default class AnimeEpisodeList extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            pagination: null,
            current_page: 1
        };
        this.getEpisodes();
    }

    getEpisodes = () => {
        App.sendGetRequest(`anime/${this.props.anime.id}/episodes?page=${this.state.current_page}`, false).then(res => {
            console.log(`anime/${this.props.anime.id}/episodes?page=${this.state.current_page}`);
            this.setState({pagination: res.data});
            console.log("Hey");
        });
    };

    nextPage = () => {
        let next_page = this.state.current_page + 1;
        this.setState({current_page: next_page}, () => {
            this.getEpisodes();
        });
    };

    previousPage = () => {
        let previous_page = this.state.current_page - 1;
        this.setState({current_page: previous_page}, () => {
            this.getEpisodes();
        });
    };

    setPage = page => {
        this.setState({current_page: page}, () => {
            this.getEpisodes();
        });
    };

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.anime !== this.props.anime) {
            this.setState({current_page: 1}, () => {
                this.getEpisodes();
            });
        }
    }

    render() {
        if (this.state.pagination !== null) {
            let cur_page = this.state.current_page;
            let max_pages = Math.ceil(this.state.pagination.count / 12);

            let page_controls = [];
            for (let i = Math.max(1, cur_page - 2); i < cur_page; i++) {
                page_controls.push(<div className="pagination-control" tabIndex={0} key={i} onClick={event => this.setPage(i)}>{i}</div>);
            }
            page_controls.push(<div className="pagination-control current-page" tabIndex={0} key={cur_page}>{cur_page}</div>);
            for (let i = 0; i < Math.min(2, max_pages - cur_page); i++) {
                page_controls.push(<div className="pagination-control" tabIndex={0} key={cur_page + i + 1} onClick={event => this.setPage(cur_page + i + 1)}>{cur_page + i + 1}</div>);
            }

            return (
                <div className="episode-pagination-container">
                    <h1 className="title"><span>Episódios</span></h1>
                    <CardLayout card_type="EpisodeListCard" items={this.state.pagination.results} image={this.props.anime.image}/>
                    <div className="spacer"/>
                    <div className="pagination-controls">
                        {cur_page > 1 ? <div className="pagination-control previous-page-control" onClick={() => this.setPage(1)} tabIndex={0}><i className="fas fa-backward fa-fw"/></div> : <div className="pagination-control previous-page-control pagination-control-disabled"><i className="fas fa-backward fa-fw"/></div>}
                        {this.state.pagination.previous !== null && this.state.pagination.previous !== undefined ? <div className="pagination-control previous-page-control" tabIndex={0} onClick={this.previousPage}><i className="fas fa-caret-left fa-fw"/></div> : <div className="pagination-control previous-page-control pagination-control-disabled"><i className="fas fa-caret-left fa-fw"/></div>}
                        {page_controls}
                        {this.state.pagination.next !== null && this.state.pagination.next !== undefined ? <div className="pagination-control next-page-control" tabIndex={0} onClick={this.nextPage}><i className="fas fa-caret-right fa-fw"/></div> : <div className="pagination-control next-page-control pagination-control-disabled"><i className="fas fa-caret-right fa-fw"/></div>}
                        {cur_page < max_pages ? <div className="pagination-control previous-page-control" tabIndex={0} onClick={() => this.setPage(max_pages)}><i className="fas fa-forward fa-fw"/></div> : <div className="pagination-control previous-page-control pagination-control-disabled"><i className="fas fa-forward fa-fw"/></div>}
                    </div>
                </div>
            );
        } else {
            return <div>Nada para ver aqui...</div>;
        }
    }

};