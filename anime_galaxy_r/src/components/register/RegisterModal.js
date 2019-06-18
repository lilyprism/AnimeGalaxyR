import React from "react";
import ReactDOM from "react-dom";
import {ToastsStore} from "react-toasts";

import ModalWindow from './../modalwindow/ModalWindow';

export default class RegisterModal extends ModalWindow {

    constructor(props) {
        super(props);

        this.state = {
            username: "",
            password: "",
            confirmPassword: "",
            email: ""
        };
    }

    handleSubmit = event => {
        event.preventDefault();
        if (this.state.password !== this.state.confirmPassword) {
            let this_el = ReactDOM.findDOMNode(this);

            if (this_el instanceof HTMLElement) {
                this_el.querySelector("#register-confirm-password-input ~ .invalid-form-msg").innerHTML = "As passwords não coincidem";
                this_el.querySelector("#register-confirm-password-input").parentElement.classList.add("invalid");
                return;
            }
        }

        this.props.register(this.state.username, this.state.password, this.state.confirmPassword, this.state.email).then(res => {
            if (res === true) {
                console.log(res);
                ToastsStore.success("Registaste-te com sucesso");
                ModalWindow.closeModal(this.props.element_id);
            }
        }).catch(error => {
            this.validateForm(error);
        });
    };

    validateForm(error) {
        document.querySelectorAll(`#${this.props.element_id} .form-group`).forEach(function (element) {
            element.classList.remove("invalid");
        });
        console.log();
        if (error.response.data !== undefined) {
            if (error.response.data.username !== undefined) {
                console.log("Username Error");
                let username_form_group = document.querySelector("#register-username-input").parentElement;

                username_form_group.querySelector(".invalid-form-msg").innerHTML = error.response.data.username.toString().replace(/,/g, "<br/>");
                username_form_group.classList.add("invalid");
            }
            if (error.response.data.password1 !== undefined) {
                console.log("Password Error");
                let password_form_group = document.querySelector("#register-password-input").parentElement;

                password_form_group.querySelector(".invalid-form-msg").innerHTML = error.response.data.password1.toString().replace(/,/g, "<br/>");
                password_form_group.classList.add("invalid");
            }
            if (error.response.data.password2 !== undefined) {
                console.log("Password Confirm Error");
                let confirm_password_form_group = document.querySelector("#register-confirm-password-input").parentElement;

                confirm_password_form_group.querySelector(".invalid-form-msg").innerHTML = error.response.data.password2.toString().replace(/,/g, "<br/>");
                confirm_password_form_group.classList.add("invalid");
            }
            if (error.response.data.email !== undefined) {
                console.log("Email Error");
                let email_form_group = document.querySelector("#register-email-input").parentElement;

                email_form_group.querySelector(".invalid-form-msg").innerHTML = error.response.data.email.toString().replace(/,/g, "<br/>");
                email_form_group.classList.add("invalid");
            }
        }
    }

    render() {
        return (
            <div id={this.props.element_id} className="modal-container">
                <div className="modal-overlay" onClick={this.handleOverlayClick}/>
                <div className="modal">
                    <span className="modal-close-btn" onClick={() => ModalWindow.closeModal(this.props.element_id)}>X</span>
                    <header className="modal-header">
                        <h1 className="title"><span>Registar</span></h1>
                    </header>
                    <form className="login-form w-100" action="" onSubmit={this.handleSubmit}>
                        <div className="modal-body">
                            <div className="login-container">
                                <div className="form-group">
                                    <label htmlFor="register-username-input">Username</label>
                                    <input className="input" spellCheck="false" type="text" name="username" id="register-username-input" onChange={event => this.setState({username: event.target.value})}/>
                                    <sub className="invalid-form-msg">Algo de errado não está certo aqui</sub>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="register-password-input">Password</label>
                                    <input className="input" type="password" name="password" id="register-password-input" onChange={event => this.setState({password: event.target.value})}/>
                                    <sub className="invalid-form-msg">Algo de errado não está certo aqui</sub>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="register-confirm-password-input">Confirmar Password</label>
                                    <input className="input" type="password" name="confirm-password" id="register-confirm-password-input" onChange={event => this.setState({confirmPassword: event.target.value})}/>
                                    <sub className="invalid-form-msg">Algo de errado não está certo aqui</sub>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="register-email-input">Email</label>
                                    <input className="input" type="email" name="email" id="register-email-input" onChange={event => this.setState({email: event.target.value})}/>
                                    <sub className="invalid-form-msg">Algo de errado não está certo aqui</sub>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <input className="btn" type="submit" value="Registar"/>
                        </div>
                    </form>
                </div>
            </div>
        );
    }

};