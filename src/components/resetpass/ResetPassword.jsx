import React, { Component } from 'react';
import axios from 'axios';
import qs from 'qs';
import classNames from 'classnames';
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom';
import ReCAPTCHA from 'react-google-recaptcha';
import apiLink from '../pagesRouter/environment';

const grecaptchaObject = window.grecaptcha;

class ResetPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pass: '',
      repeatPass: '',
      validfield: {
        pass: true,
        repeatPass: true,
        captcha: false,
      },
      sendRequest: true,
      linkExpired: true,
      successReset: false,
      errorMsg:''
    };
    document.title = this.props.t[this.props.language].projectName + ' – Reset Password';
  }

  componentDidMount() {
    // TODO def params for validation   -- что это??
    const key = this.props.location.search.split('=')[1]; // можно же вытащить из props.match.params передав параметры через роут
    axios({
      method: 'post',
      url: apiLink + 'checkresetlink',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      data: qs.stringify({
        key: key,
      }),
    })
      .then(resp => {
        if (resp.status === 200) {
          const { data } = resp;
          if (data.status === 'ok') {
            this.setState({ linkExpired: false, sendRequest: true, successReset: false });
          } else {
            throw new Error();
            // this.setDefaultState({ errorMsg: data.msg })
          }
        } else {
          throw new Error();
        }
      })
      .catch(error => {
        if (error.response) {
          // TODO добавь console.log или console.error чтобы видеть какие ошибки приходят
        } else if (error.request) {
          // TODO добавь console.log или console.error чтобы видеть какие ошибки приходят
        } else {
          // TODO добавь console.log или console.error чтобы видеть какие ошибки приходят
          this.setState({ linkExpired: true, sendRequest: false, successReset: false });
        }
      });
  }

  onChangeCaptcha = val => {
    const errors = { ...this.state.validfield };
    errors.captcha = val !== '' ? true : false;
    this.setState({ captcha: val, validfield: errors });
  };

  onPasswordChange = e => {
    const { value } = e.target;
    this.setState({ pass: value }, () => {
      this.validatePass(value);
    });
  };

  validatePass(value) {
    const errors = { ...this.state.validfield };
    const valid = !!value;
    errors.pass = valid;
    this.setState({ validfield: errors });
  }

  onRepeatPasswordChange = e => {
    const { value } = e.target;
    this.setState({ repeatPass: value }, () => {
      this.validateRepeatPass(value);
    });
  };

  validateRepeatPass(value, next = () => {}) {
    const errors = { ...this.state.validfield };
    const valid = !!value && value === this.state.pass;
    errors.repeatPass = valid;
    this.setState({ validfield: errors }, next);
  }

  validateForm() {
    const valid = Object.values(this.state.validfield).some(val => val === false);
    return !valid;
  }

  onSubmitClick = e => {
    const { pass, repeatPass } = this.state;
    e.preventDefault();
    if (pass !== '' && repeatPass !== '' && this.validateForm()) {
      this.resetPass();
    }
  };

  resetPass() {
    const key = this.props.location.search.split('=')[1]; // можно же вытащить из props.match.params передав параметры через роут
    const { pass, repeatPass } = this.state;
    axios({
      method: 'post',
      url: apiLink + 'resetpassemail',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      data: qs.stringify({
        key: key,
        pass: pass,
        pass_confirm: repeatPass,
      }),
    })
      .then(resp => {
        if (resp.status === 200) {
          const { data } = resp;
          if (data.status === 'ok') {
            this.setState({ linkExpired: false, sendRequest: false, successReset: true });
          } else {
            this.setDefaultState({ errorMsg: data.msg });
          }
        } else {
          throw new Error();
        }
      })
      .catch(error => {
        if (error.response) {
          // TODO добавь console.log или console.error чтобы видеть какие ошибки приходят
        } else if (error.request) {
          // TODO добавь console.log или console.error чтобы видеть какие ошибки приходят
        } else {
          // TODO добавь console.log или console.error чтобы видеть какие ошибки приходят
          const { validfield } = this.state;
          validfield.pass = false;
          validfield.repeatPass = false;
          validfield.captcha = false;
          this.setState({ validfield });
        }
      });
  }

  getShowClass(r) { //TODO: желательно переменные называть более детально
    return r ? 'visible' : 'hidden';
  }

  render() {
    if (this.props.authUserData && this.props.authUserData.authorized) {
      return <Redirect to="/exchange" />;
    }

    const { pass, repeatPass, linkExpired, validfield, sendRequest, successReset, errorMsg } = this.state;

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
      disabled: !validfield.captcha,
    });

    let hide = this.getShowClass(sendRequest);
    const containerClasses = classNames(['flex', 'cards']);
    const wrapperClasses = classNames(['reset-password-wrapper', hide]);

    hide = this.getShowClass(linkExpired);
    const wrapperExpiredClasses = classNames(['wrapper-note', hide]);
    const sendmailClasses = classNames(['reset-pass__sendmail']);

    hide = this.getShowClass(successReset);
    const wrapperSuccessClasses = classNames(['wrapper-note', hide]);

    const errorClass = errorMsg !== '' ? 'network-error' : 'hidden';
    return (
      <div className="container page-login">
        <div className={wrapperClasses}>
          <h1 className="reset-pass">Reset you password</h1>
          <div className={containerClasses}>
            <div className="card card-form">
              <form>
                <div className={passClasses}>
                  <label htmlFor="pass">
                    {this.props.t[this.props.language].resetPassPage.newPass}
                  </label>
                  <input
                    placeholder="password"
                    type="password"
                    name="pass"
                    value={pass}
                    onChange={this.onPasswordChange}
                  />
                </div>
                <div className={repeatPassClasses}>
                  <label htmlFor="repeatpass">
                    {this.props.t[this.props.language].resetPassPage.repeatNewPass}
                  </label>
                  <input
                    placeholder="password"
                    type="password"
                    name="repeatpass"
                    value={repeatPass}
                    onChange={this.onRepeatPasswordChange}
                  />
                </div>
                <div className={errorClass}>{errorMsg}</div>
                <div className="b-captcha">
                  <ReCAPTCHA
                    ref={r => (this.recaptcha = r)}
                    sitekey="6LcsGHcUAAAAAPKFjtlNvOxYjrOYdXgZp-q0IiqA"
                    onChange={this.onChangeCaptcha}
                    grecaptcha={grecaptchaObject}
                  />
                </div>
                <div className="form-element submit">
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
                <h3 className="reset-pass">{this.props.t[this.props.language].forgotPassPage.forgot}</h3>
                <h3 className="reset-pass">{this.props.t[this.props.language].forgotPassPage.useform}</h3>
                <p className="settings-form__p">
                  {this.props.t[this.props.language].resetPassPage.noteMsg}
                </p>
                <p className="settings-form__p">
                  {this.props.t[this.props.language].resetPassPage.warningNote}
                </p>
              </div>              
            </div>
          </div>
        </div>
        <div className={wrapperSuccessClasses}>
          <div className={sendmailClasses}>
            <div>
              <h3 className="reset-pass">{this.props.t[this.props.language].resetPassPage.successMsg}</h3>
              <div className="reset-pass__link-button">
                <Link to="/login">{this.props.t[this.props.language].resetPassPage.login}</Link>
              </div>
            </div>
          </div>
        </div>

        <div className={wrapperExpiredClasses}>
          <div className={sendmailClasses}>
            <div>
              <h3 className="reset-pass">{this.props.t[this.props.language].resetPassPage.invalidExpiredMsg}</h3>
              <div className="reset-pass__link-button">
                <Link to="/resetpassword">
                  {this.props.t[this.props.language].resetPassPage.back}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ResetPassword;
