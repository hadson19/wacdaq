import React, { Component } from 'react';
import axios from 'axios';
import qs from 'qs';
import classNames from 'classnames';
import apiLink from '../pagesRouter/environment';
import Cookies from 'universal-cookie';

const cookies = new Cookies();
let userAuthKey = cookies.get('userAuthKey');
let user_id = cookies.get('user_id');


class DisableTwoFactorAuth extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: this.props.authUserData.email,
            pass: '',
            code: '',
            validfield: {
                code: true,
                pass: true,
            },
            formValid: false,
            successReset: false,
            netError:''
        };
        document.title = this.props.t[this.props.language].projectName + ' – 2FA';
    }

    onPasswordChange = e => {
        const { value } = e.target;
        const vf = this.validatePass(value);
        this.setState({ pass: value, validfield: vf });
    };

    validatePass(value) {
        const errors = { ...this.state.validfield };
        const valid = !!value;
        errors.pass = valid;
        return errors;
    }

    onCodeChange = e => {
        const { value } = e.target;
        const vf = this.validateCode(value);
        this.setState({ code: value, validfield: vf });
    };

    validateCode(value) {
        const errors = { ...this.state.validfield };
        const valid = !!value ;
        errors.code = valid;
        return errors;
    }

    validateForm(e) {
        //console.log('validate form', e);
        const { pass, code } = this.state;
        const valid = !Object.values(this.state.validfield).some(val => val === false);
        if (pass !== ''  && code !== '' && valid) {
            return true;
        }
        return false;
    }

    setDefaultState(error) {
        const validDef = {
            code: true,
            pass: true,
        };
        const validError = {
            code: true,
            pass: true,
        };

        let valid = validDef;
        if (error) {
            valid = validError;
        }

        const _state = {
            oldpass: '',
            pass: '',
            repeatPass: '',
            validfield: valid,
            formValid: false,
            successReset: false,
            errorMsg: ''
        };

        this.setState({ ..._state });
    }

    onSubmitClick = e => {
        e.preventDefault();
        this.resetPass(this.state.pass);
    };

    resetPass(pass) {
        const {auth_key, id } = this.props.authUserData;
        axios({
            method: 'post',
            url: apiLink + 'triggergauth',
            headers: { 'content-type': 'application/x-www-form-urlencoded' },
            data: qs.stringify({
                auth_key: auth_key,
                id_user: id,
                password: this.state.pass,
                code: this.state.code
            }),
        })
            .then(resp => {
                if (resp.status === 200) {
                    const { data } = resp;
                    if (data.status === 'ok') {
                        this.props.goBack();
                    } else {
                        this.setState({ errorMsg: data.msg });
                    }
                } else {
                    throw new Error();
                }
            })
            .catch(error => {
                if (error.response) {
                    // TODO добавь console.log или console.error чтобы видеть какие ошибки приходят
                    this.setDefaultState(true);
                } else if (error.request) {
                    // TODO добавь console.log или console.error чтобы видеть какие ошибки приходят
                    this.setDefaultState(true);
                } else {
                    this.setDefaultState(true);

                }
            });
    }

    printSecret(){
        window.print();
    }

    render() {
        const { validfield, pass, code, email, errorMsg } = this.state;
        const valid = this.validateForm();

        const oldpassClasses = classNames({
            'form-element': true,
        });
        const passClasses = classNames({
            'form-element': true,
            pass: true,
            'pass-error': !validfield.pass,
        });
        const repeatPassClasses = classNames({
            'form-element': true,
            pass: true,
            'pass-error': !validfield.repeatPass,
        });
        const inputClasses = classNames({
            'reset-pass__submit': true,
            'settings-form__submit': true,
            disabled: !valid,
        });

        const containerClasses = classNames(['flex', 'cards']);
        const wrapperClasses = classNames(['settings-form__wrapper']);
        const errorClass = errorMsg !== '' ? 'network-error' : 'hidden';

        return (
            <div className="settings-form">
                <div className={wrapperClasses}>                   
                    <div className={containerClasses}>                    
                        <div className="card card-form">
                            <h1 className="reset-pass">{this.props.t[this.props.language].disableTwoFactorAuthPAge.header}</h1>
                            <form>
                                <div className="form-element">
                                   <p className='settings-form__p'>
                                        {this.props.t[this.props.language].disableTwoFactorAuthPAge.note}
                                   </p>
                                </div>

                                <div className={oldpassClasses}>
                                    <label htmlFor="email"> {this.props.t[this.props.language].disableTwoFactorAuthPAge.email}</label>
                                    <h3 className="email-2fa">{email}</h3>                                    
                                </div>
                                <div className={passClasses}>
                                    <label htmlFor="pass"> {this.props.t[this.props.language].disableTwoFactorAuthPAge.pass}</label>
                                    <input
                                        placeholder="password"
                                        type="password"
                                        name="pass"
                                        value={pass}
                                        onChange={this.onPasswordChange}
                                    />
                                </div>
                                <div className={repeatPassClasses}>
                                    <label htmlFor="code"> {this.props.t[this.props.language].disableTwoFactorAuthPAge.code}</label>
                                    <input
                                        placeholder="code"
                                        type="text"
                                        name="code"
                                        value={code}
                                        onChange={this.onCodeChange}
                                    />
                                </div>
                                <div className={errorClass}>{errorMsg}</div>
                                <div className="form-element submit">
                                    <input
                                        disabled={!valid}
                                        type="submit"
                                        value="Disable 2FA"
                                        className={inputClasses}
                                        onClick={this.onSubmitClick}
                                    />
                                </div>
                            </form>
                        </div>
                        <div className="card card-note">
                            <h1 className="reset-pass"> {this.props.t[this.props.language].disableTwoFactorAuthPAge.withdraw}</h1>
                            <p className="settings-form__p">
                                {this.props.t[this.props.language].disableTwoFactorAuthPAge.withdrawNote}
                           </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default DisableTwoFactorAuth;
