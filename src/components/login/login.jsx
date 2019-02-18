import React, { Component } from 'react'
import axios from 'axios';
import qs from 'qs';
import classNames from 'classnames';
import Cookies from 'universal-cookie';
import { Redirect } from 'react-router'
import { Link} from 'react-router-dom';
import ReCAPTCHA from "react-google-recaptcha";
import apiLink from '../pagesRouter/environment';

// const cookies = new Cookies();
// let userAuthKey = cookies.get('userAuthKey');
// let user_id = cookies.get('user_id');

const grecaptchaObject = window.grecaptcha;

class login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loginIncorrectAccess: false,
            captchaLoginValue: '',
            captchaRegistrValue: '',
            loginEmail: '',
            loginPassword: '',
            loginErrorFields: {},
            registrationEmail: '',
            registrationPassword: '',
            registrationRepeatPassword: '',
            registrationAgreement: false,
            registrationErrorFields: {},
            registrStatus: true,
            code:'',
            $ud:null,
            waitCode: false,
            errorMsg: ''
        };
        document.title = this.props.t[this.props.language].projectName + " – Login/Registration";

        this.CaptchaLoginOnChange = this.CaptchaLoginOnChange.bind(this);
        this.CaptchaRegistrOnChange = this.CaptchaRegistrOnChange.bind(this);
        this.handleLoginEmailChange = this.handleLoginEmailChange.bind(this);
        this.handleLoginPasswordChange = this.handleLoginPasswordChange.bind(this);
        this.handleRegistrationEmailChange = this.handleRegistrationEmailChange.bind(this);
        this.handleRegistrationPasswordChange = this.handleRegistrationPasswordChange.bind(this);
        this.handleRegistrationRepeatPasswordChange = this.handleRegistrationRepeatPasswordChange.bind(this);
        this.handleRegistrationAgreementChange = this.handleRegistrationAgreementChange.bind(this);

        // this.login = this.login.bind(this);
        this.registration = this.registration.bind(this);
    }

    componentDidMount() {
        window.scrollTo(0, 0);
    }

    handleLoginEmailChange(event) {
        this.setState({ loginEmail: event.target.value });
    }

    handleLoginPasswordChange(event) {
        this.setState({ loginPassword: event.target.value });
    }

    handleRegistrationEmailChange(event) {
        this.setState({ registrationEmail: event.target.value });
    }

    handleRegistrationPasswordChange(event) {
        this.setState({ registrationPassword: event.target.value });
    }

    handleRegistrationRepeatPasswordChange(event) {
        this.setState({ registrationRepeatPassword: event.target.value });
    }

    handleRegistrationAgreementChange(event) {
        this.setState({ registrationAgreement: event.target.checked });
    }

    onCodeChange = (e)=>{
        const {value} = e.target;
        this.setState({code:value});
    }

    CaptchaLoginOnChange(value) {
        this.setState({
            captchaLoginValue: value
        })
    }

    CaptchaRegistrOnChange(value) {
        this.setState({
            captchaRegistrValue: value
        })
    }

    virefyGAuthCode=(e)=>{
        e.preventDefault();
        const {code, $ud} = this.state;
        if(code===''){
            return
        }

        axios({
            method: 'post',
            url: apiLink + 'checkgauth',
            headers: { 'content-type': 'application/x-www-form-urlencoded' },
            data: qs.stringify({
                auth_key: $ud.auth_key,
                id_user: $ud.id,
                code: code
            }),
        })
            .then(resp => {
                if (resp.status === 200) {
                    const { data } = resp;
                    if (data.status === 'ok') {
                        this.setCoockie($ud);
                    } else {
                        this.setState({ errorMsg: data.msg });
                    }
                } else {
                    throw new Error();
                }
            })
            .catch(error => {
                if (error.response) {
                    // TODO
                } else if (error.request) {
                    // TODO
                } else {
                    // TODO
                }
            });
    }

    setCoockie=(data)=>{
        const cookies = new Cookies();
        cookies.set('userAuthKey', data.auth_key, { path: '/' });
        cookies.set('user_id', data.id, { path: '/' });
        this.props.login(data);
    }

    login=(event)=> {
        event.preventDefault();

        let emailField = this.state.loginEmail;
        let passwordField = this.state.loginPassword;

        if (emailField !== '' && passwordField !== '') {
            this.setState({ loginIncorrectAccess: false });
            axios({
                method: 'post',
                url: apiLink + 'authorization',
                headers: { 'content-type': 'application/x-www-form-urlencoded' },
                data: qs.stringify({
                    email: emailField,
                    password: passwordField
                }),
            })
                .then((response) => {
                    if (!response.data.userData['2fa']){
                        this.setCoockie(response.data.userData);
                    } else{
                        this.setState({ loginErrorFields: {}, $ud: response.data.userData, waitCode: true });
                    } 
                               
                })
                .catch((error) => {
                    if (error.response) {
                        if (error.response.status === 400) {
                            this.setState({ loginIncorrectAccess: true });
                            if (typeof (error.response.data.error_fields) !== 'undefined') {
                                this.setState({ loginErrorFields: error.response.data.error_fields });
                            } else {
                                this.setState({ loginErrorFields: {} });
                            }
                        }
                    }
                });
        } else {
            this.setState({ loginIncorrectAccess: true });
        }
    }

    registration(event) {
        event.preventDefault();

        let emailField = this.state.registrationEmail;
        let passwordField = this.state.registrationPassword;

        let registrationErrorFields = {};

        if (!this.state.registrationEmail) {
            registrationErrorFields.email = 'E-mail can\'t be empty';
        }

        if (!this.state.registrationPassword) {
            registrationErrorFields.password = 'Password can\'t be empty';
        }

        if (this.state.registrationPassword !== this.state.registrationRepeatPassword) {
            registrationErrorFields.repeatPassword = 'Passwords do not match';
        }

        if (!this.state.registrationAgreement) {
            registrationErrorFields.agreement = 'You have to agree with Terms & Conditions';
        }

        this.setState({ registrationErrorFields: registrationErrorFields });

        if (!Object.keys(registrationErrorFields).length) {
            axios({
                method: 'post',
                url: apiLink + 'registration',
                headers: { 'content-type': 'application/x-www-form-urlencoded' },
                data: qs.stringify({
                    email: emailField,
                    password: passwordField
                }),
            })
                .then((response) => {
                    this.setState({
                        registrationErrorFields: {},
                        registrStatus: false
                    });
                    // this.props.login(response.data.userData);
                })
                .catch((error) => {
                    if (error.response) {
                        if (error.response.status === 400) {
                            if (typeof (error.response.data.error_fields) !== 'undefined') {
                                this.setState({ registrationErrorFields: error.response.data.error_fields });
                            } else {
                                this.setState({ registrationErrorFields: {} });
                            }
                        }
                    }
                });
        }
    }

    render() {

        if (this.props.authUserData && this.props.authUserData.authorized)
            return <Redirect to="/exchange" />;

        let loginEmailClasses = ['login-field', 'login-field_email'];
        if (typeof (this.state.loginErrorFields.email) !== 'undefined') {
            loginEmailClasses.push('login-field_error');
        }
        loginEmailClasses = classNames(loginEmailClasses);

        let loginPasswordClasses = ['login-field', 'login-field_password'];
        if (typeof (this.state.loginErrorFields.password) !== 'undefined') {
            loginPasswordClasses.push('login-field_error');
        }
        loginPasswordClasses = classNames(loginPasswordClasses);

        let registrationPasswordClasses = ['registration-field-input'];
        if (typeof (this.state.registrationErrorFields.password) !== 'undefined') {
            registrationPasswordClasses.push('registration-field-input_error');
        }
        registrationPasswordClasses = classNames(registrationPasswordClasses);

        let registrationRepeatPasswordClasses = ['registration-field-input'];
        if (typeof (this.state.registrationErrorFields.repeatPassword) !== 'undefined') {
            registrationRepeatPasswordClasses.push('registration-field-input_error');
        }
        registrationRepeatPasswordClasses = classNames(registrationRepeatPasswordClasses);

        let registrationAgreementClasses = ['registration-agreement'];
        if (typeof (this.state.registrationErrorFields.agreement) !== 'undefined') {
            registrationAgreementClasses.push('registration-agreement_error');
        }
        registrationAgreementClasses = classNames(registrationAgreementClasses);

        let registrationEmailClasses = ['registration-field', 'registration-field_email'];
        if (typeof (this.state.registrationErrorFields.email) !== 'undefined') {
            registrationEmailClasses.push('registration-field_error');
        }
        registrationEmailClasses = classNames(registrationEmailClasses);


        const loginClass = `login ${this.state.waitCode? 'hidden': ''}`;
        const registerClass = `registration ${this.state.waitCode ? 'hidden' : ''}`;
        const codeClass = `code-msg ${this.state.waitCode ? '' : 'hidden'}`;
        const loginAndRegistration = `loginAndRegistration ${this.state.waitCode ? 'loginAndRegistration-divider-false' : ''}`;
        const errorClass = this.state.errorMsg !== '' ? 'network-error_p20' : 'hidden';
        return <div className="container page-login">
            <div className={loginAndRegistration}>
                <div className={loginClass}>
                    <form onSubmit={this.login} >
                        <div className="login-title">
                            {this.props.t[this.props.language].loginPage.login}
                        </div>
                        {/* <div className={loginEmailClasses}> */}
                        <div className={this.state.loginIncorrectAccess ? 'login-field login-field_email login-field_error' : 'login-field login-field_email'}>
                            <div className="login-field-label">
                                {this.props.t[this.props.language].loginPage.email}
                            </div>
                            <div className="login-field-input">
                                <input type="text" value={this.state.loginEmail} onChange={this.handleLoginEmailChange} placeholder={this.props.t[this.props.language].loginPage.email} />
                            </div>
                        </div>
                        <div className={this.state.loginIncorrectAccess ? 'login-field login-field_email login-field_error' : 'login-field login-field_email'}>
                            <div className="login-field-label">
                                {this.props.t[this.props.language].loginPage.password}
                            </div>
                            <div className="login-field-input">
                                <input type="password" value={this.state.loginPassword} onChange={this.handleLoginPasswordChange} placeholder={this.props.t[this.props.language].loginPage.password} />
                            </div>
                        </div>
                        <div className={registrationAgreementClasses}>
                        <Link className="registration-agreement" to="/resetpassword">{this.props.t[this.props.language].loginPage.forgotPass}</Link>
                        </div>
                        <div className={this.state.loginIncorrectAccess ? 'login-field msg-incorrect' : 'login-field b-hide'}>
                            {this.props.t[this.props.language].loginPage.incorrectAccess}
                        </div>
                        <div className="b-captcha">
                            <ReCAPTCHA
                                ref={(r) => this.recaptcha = r}
                                sitekey="6LcsGHcUAAAAAPKFjtlNvOxYjrOYdXgZp-q0IiqA"
                                onChange={this.CaptchaLoginOnChange}
                                grecaptcha={grecaptchaObject}
                            />
                        </div>
                        <div className="login-submit">
                            <input
                                type="submit"
                                value={this.props.t[this.props.language].loginPage.login}
                                className={this.state.captchaLoginValue ? null : 'disabled'}
                                disabled={!this.state.captchaLoginValue}
                            />
                        </div>
                    </form>
                </div>
                <div className={registerClass}>
                    <form onSubmit={this.registration} className={this.state.registrStatus ? 'visible' : 'hidden'}>
                        <div className="registration-title">
                            {this.props.t[this.props.language].loginPage.registration}
                        </div>
                        <div className={registrationEmailClasses}>
                            <div className="registration-field-label">
                                {this.props.t[this.props.language].loginPage.email}
                            </div>
                            <div className="registration-field-input">
                                <input type="email" value={this.state.registrationEmail} onChange={this.handleRegistrationEmailChange} placeholder={this.props.t[this.props.language].loginPage.email} />
                            </div>
                        </div>
                        <div className="registration-field registration-field_password">
                            <div className="registration-field-label">
                                {this.props.t[this.props.language].loginPage.password}
                            </div>
                            <div className={registrationPasswordClasses}>
                                <input type="password" value={this.state.registrationPassword} onChange={this.handleRegistrationPasswordChange} placeholder={this.props.t[this.props.language].loginPage.password} />
                            </div>
                            <div className={registrationRepeatPasswordClasses}>
                                <input type="password" value={this.state.registrationRepeatPassword} onChange={this.handleRegistrationRepeatPasswordChange} placeholder={this.props.t[this.props.language].loginPage.repeatPassword} />
                            </div>
                        </div>
                        <div className={registrationAgreementClasses}>
                            <input id="agreement" type="checkbox" value="1" checked={this.state.registrationAgreement} onChange={this.handleRegistrationAgreementChange} name="agreement" />
                            <label htmlFor="agreement">
                                <a href="https://goo.gl/KhPS1c" target="_blank" rel="noopener noreferrer">
                                    {this.props.t[this.props.language].loginPage.agreements}
                                </a>
                            </label>
                        </div>
                        <div className="b-captcha">
                            <ReCAPTCHA
                                ref={(r) => this.recaptcha = r}
                                sitekey="6LcsGHcUAAAAAPKFjtlNvOxYjrOYdXgZp-q0IiqA"
                                onChange={this.CaptchaRegistrOnChange}
                                grecaptcha={grecaptchaObject}
                            />
                        </div>
                        <div className="registration-submit">
                            <input
                                type="submit"
                                className={this.state.captchaRegistrValue ? null : 'disabled'}
                                value={this.props.t[this.props.language].loginPage.registration}
                                disabled={!this.state.captchaRegistrValue}
                            />
                        </div>
                    </form>
                    <div className="b-email-send" >
                        A letter has been sent to your email to confirm the address
                    </div>
                </div>


                <div className={codeClass}>
                    <form onSubmit={this.virefyGAuthCode} >                        
                        <div className={registrationEmailClasses}>
                            <div className="registration-field-label margin-0">
                                You have 2 factor authentication enabled.
                            </div>
                            <div className="registration-field-label margin-0">
                                Please enter Your Google Authenticator Six-Digit
                            </div>
                            <div className="padding-top-20">
                                <input className="login-code__code-input" type="text" value={this.state.code} 
                                onChange={this.onCodeChange} 
                            />
                            </div>
                            <div className={errorClass}>{this.state.errorMsg}</div>
                        </div>
                        <div className="registration-submit code-msg__btn">
                            <input
                                type="submit"                                
                                value="CONTINUE"                                
                            />
                        </div>
                    </form>
                </div>
            </div>
        </div>;

    }
}

export default login;
