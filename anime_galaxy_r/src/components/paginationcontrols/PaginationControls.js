import React from 'react';

import "./paginationcontrols.sass";

export default class PaginationControls extends React.Component {

    render() {
        let max_pages = Math.ceil(this.props.count / this.props.perPage);

        let page_controls = [];
        for (let i = Math.max(1, this.props.page - 2); i < this.props.page; i++) {
            page_controls.push(<div className="pagination-control" tabIndex={0} key={i} onClick={event => this.props.setPage(i)}>{i}</div>);
        }

        page_controls.push(<div className="pagination-control current-page" tabIndex={0} key={this.props.page}>{this.props.page}</div>);

        for (let i = 0; i < Math.min(2, max_pages - this.props.page); i++) {
            page_controls.push(
                <div className="pagination-control" tabIndex={0} key={this.props.page + i + 1}
                     onClick={event => this.props.setPage(this.props.page + i + 1)}>
                    {this.props.page + i + 1}
                </div>
            );
        }

        if (max_pages > 1) {
            return (
                <div className="pagination-controls">
                    {this.props.page > 1 ? <div className="pagination-control previous-page-control" onClick={() => this.props.setPage(1)} tabIndex={0}><i className="fas fa-backward fa-fw"/></div> : <div className="pagination-control previous-page-control disabled"><i className="fas fa-backward fa-fw"/></div>}
                    {this.props.previous != null ? <div className="pagination-control previous-page-control" tabIndex={0} onClick={() => this.props.setPage(this.props.page - 1)}><i className="fas fa-caret-left fa-fw"/></div> : <div className="pagination-control previous-page-control pagination-control disabled"><i className="fas fa-caret-left fa-fw"/></div>}
                    {page_controls}
                    {this.props.next != null ? <div className="pagination-control next-page-control" tabIndex={0} onClick={() => this.props.setPage(Math.min(this.props.page + 1, max_pages))}><i className="fas fa-caret-right fa-fw"/></div> : <div className="pagination-control next-page-control pagination-control disabled"><i className="fas fa-caret-right fa-fw"/></div>}
                    {this.props.page < max_pages ? <div className="pagination-control previous-page-control" tabIndex={0} onClick={() => this.props.setPage(max_pages)}><i className="fas fa-forward fa-fw"/></div> : <div className="pagination-control previous-page-control disabled"><i className="fas fa-forward fa-fw"/></div>}
                </div>
            );
        } else {
            return "";
        }
    }

};