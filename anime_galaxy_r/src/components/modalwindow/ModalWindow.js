import React from 'react';

import "./modalwindow.sass";

export default class ModalWindow extends React.Component {

    constructor(props) {
        super(props);

        if (window.openModal === undefined && window.closeModal === undefined) {
            window.openModal = function (id) {
                document.getElementById(id).classList.add("open");
            };
            window.closeModal = function (id) {
                document.getElementById(id).classList.remove("open");
            };
        }
    }

    handleOverlayClick = () => {
        window.closeModal(this.props.element_id);
    };

    static openModal = id => {
        window.openModal(id);
    };

    static closeModal = id => {
        window.closeModal(id);
    };

};
