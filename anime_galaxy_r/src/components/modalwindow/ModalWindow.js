import React from 'react';

import "./modalwindow.sass";

export default class ModalWindow extends React.Component {

    constructor(props) {
        super(props);

        if (window.openModal === undefined && window.closeModal === undefined) {
            window.openModal = function (id) {
                if (document.getElementById(id) !== null) {
                    document.getElementById(id).classList.add("open");
                    let first_input = document.getElementById(id).querySelector(".input");
                    if (first_input) {
                        first_input.focus();
                    }
                }
                document.querySelector("body").classList.add("overflow-hidden");
            };
            window.closeModal = function (id) {
                if (document.getElementById(id) !== null) {
                    document.getElementById(id).classList.remove("open");
                }
                document.querySelector("body").classList.remove("overflow-hidden");
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
