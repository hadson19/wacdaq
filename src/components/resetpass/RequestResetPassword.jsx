import React, { Component } from 'react';
import axios from 'axios';
import qs from 'qs';
import classNames from 'classnames';
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom';
import ReCAPTCHA from 'react-google-recaptcha';
import apiLink from '../pagesRouter/environment';

const grecaptchaObject = window.grecaptcha;

class RequestResetPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      validfield: {
        email: true,
        captcha: false,
      },
      sendRequest: false,
      unknownMail: false,
    };
    document.title = this.props.t[this.props.language].projectName + ' – Reset Password';
  }

  onChangeCaptcha = val => {
    const errors = { ...this.state.validfield };
    errors.captcha = val !== '' ? true : false;
    this.setState({ captcha: val, validfield: errors });
  };

  onEmailChange = e => {
    const { value } = e.target;
    this.setState({ email: value, unknownMail: false }, () => {
      this.validateEmail(value);
    });
  };

  validateEmail(value) {
    const errors = { ...this.state.validfield };
    const mailReg = /^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i;
    const valid = value !== '' && mailReg.test(value);
    errors.email = valid;
    this.setState({ validfield: errors });
  }

  validateForm() {
    const valid = Object.values(this.state.validfield).some(val => val === false);
    return !valid;
  }

  onSubmitClick = e => {
    e.preventDefault();
    const { email } = this.state;
    if (this.validateForm()) {
      this.sendMail(email);
    }
  };

  sendMail(email) {
    axios({
      method: 'post',
      url: apiLink + 'sendresetlink',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      data: qs.stringify({
        email: email,
      }),
    })
      .then(resp => {
        if (resp.status === 200) {
          const { data } = resp;
          if (data.status === 'ok') {
            this.setState({ sendRequest: true });
          } else {
            this.setState({ validfield: false, unknownMail: true });
          }
        } else {
          throw new Error();
        }
      })
      .catch(error => {       
          const { validfield } = this.state;
          validfield.email = false;
          this.setState({ validfield });
      });
  }

  getShowClass(r) {
    //TODO: желательно переменные называть более детально
    return r ? 'hidden' : 'visible';
  }

  render() {
    if (this.props.authUserData && this.props.authUserData.authorized)
      return <Redirect to="/exchange" />;
    const { email, unknownMail } = this.state;
    const { validfield, sendRequest } = this.state;

    const emailClasses = classNames({
      'form-element': true,
      email: true,
      'registration-field_error': !validfield.email,
    });

    const inputClasses = classNames({
      'reset-pass__submit': true,
      disabled: !validfield.captcha,
    });

    let hide = this.getShowClass(sendRequest);
    const containerClasses = classNames(['flex', 'cards']);
    const wrapperClasses = classNames(['reset-password-wrapper', hide]);

    hide = this.getShowClass(!sendRequest);
    const wrapperNoteClasses = classNames(['wrapper-note', hide]);
    const sendmailClasses = classNames(['reset-pass__sendmail']);

    const errorClass = unknownMail ? 'network-error' : 'hidden';
    return (
      <div className="container page-login">
        <div className={wrapperClasses}>
          <h1 className="reset-pass">Reset you password</h1>
          <div className={containerClasses}>
            <div className="card card-form">
              <form>
                <div className={emailClasses}>
                  <label htmlFor="email">
                    {this.props.t[this.props.language].forgotPassPage.email}
                  </label>
                  <input
                    placeholder="email"
                    type="email"
                    name="email"
                    value={email}
                    onChange={this.onEmailChange}
                  />
                </div>
                <div className={errorClass}>User not found.</div>
                <div className="b-captcha">
                  <ReCAPTCHA
                    ref={r => (this.recaptcha = r)}
                    sitekey="6LcsGHcUAAAAAPKFjtlNvOxYjrOYdXgZp-q0IiqA"
                    onChange={this.onChangeCaptcha}
                    grecaptcha={grecaptchaObject}
                  />
                </div>
                <div className="form-element submit {}">
                  <input
                    type="submit"
                    value="submit"
                    className={inputClasses}
                    onClick={this.onSubmitClick}
                  />
                </div>
              </form>
            </div>
            <div className="card card-note">
              <div className="card-note__note">
                <h3 className="reset-pass">
                  {this.props.t[this.props.language].forgotPassPage.forgot}
                </h3>
                <h3 className="reset-pass">
                  {this.props.t[this.props.language].forgotPassPage.useform}
                </h3>
                <p className="settings-form__p">
                  {this.props.t[this.props.language].forgotPassPage.useFormMsg}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className={wrapperNoteClasses}>
          <div className={sendmailClasses}>
            <div>
              <h3 className="reset-pass">
                {this.props.t[this.props.language].forgotPassPage.noteMsg1}
              </h3>
              <h3 className="reset-pass">
                {this.props.t[this.props.language].forgotPassPage.noteMsg2}
                <Link className="reset-pass__supplink" to="/support">
                  {this.props.t[this.props.language].forgotPassPage.callSupp}
                </Link>
                .
              </h3>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default RequestResetPassword;
