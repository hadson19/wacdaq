import React, { Component } from 'react';
import axios from 'axios';
import qs from 'qs';
import classNames from 'classnames';
import apiLink from '../pagesRouter/environment';
import Cookies from 'universal-cookie';

const cookies = new Cookies();
let userAuthKey = cookies.get('userAuthKey');
let user_id = cookies.get('user_id');

class TwoFactorAuth extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: this.props.authUserData.email,
      pass: '',
      code: '',
      agree: false,
      validfield: {
        code: true,
        pass: true,
      },
      formValid: false,
      successReset: false,
      $secretCode: '',
      $img: '',
      errorMsg: '',
    };
    document.title = this.props.t[this.props.language].projectName + ' – 2FA';
  }

  componentDidMount() {
    const { auth_key, id } = this.props.authUserData;
    axios({
      method: 'post',
      url: apiLink + 'getgauth',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      data: qs.stringify({
        auth_key: auth_key,
        id_user: id,
      }),
    })
      .then(resp => {
        if (resp.status === 200) {
          const { data } = resp.data;         
          if (resp.data.status === 'ok') {
            const img = new Image();
            img.onload = () => {
              this.setState({ errorMsg:'', $secretCode: data.secret, $img: img.src });
            };
            img.src = data.img;            
          } else {
            this.setState({ errorMsg: data.msg });
          }
        } else {
          throw new Error();
        }
      })
      .catch(error => {
        this.setDefaultState();
      });
  }

  onAgreeChange = e => {
    const { checked } = e.target;
    const errors = { ...this.state.validfield };
    errors.agree = checked;
    this.setState({ agree: checked, validfield: errors });
  };

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
    const valid = !!value;
    errors.code = valid;
    return errors;
  }

  validateForm(e) {
    const { pass, code, agree } = this.state;
    const valid = !Object.values(this.state.validfield).some(val => val === false);
    if (pass !== '' && agree && code !== '' && valid) {
      return true;
    }
    return false;
  }

  setDefaultState(stateParams = {}) {
    const valid = {
      code: true,
      pass: true,
      agree: true,
    };

    const _state = {
      code: '',
      pass: '',
      agree: false,
      validfield: valid,
      formValid: false,
      successReset: false,
    };

    this.setState({ ..._state, ...stateParams });
  }

  onSubmitClick = e => {
    const { auth_key, id } = this.props.authUserData;
    e.preventDefault();
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
            this.setState({ errorMsg: '' }, this.props.goNext);
          } else {
            this.setState({ errorMsg: data.msg });
          }
        }
      })
      .catch(err => {
        this.setDefaultState();
      });
  };

  printSecret() {
    window.print();
  }

  render() {
    const { validfield, pass, code, agree, $secretCode, email, errorMsg } = this.state;
    const valid = this.validateForm();

    const emailClasses = classNames({
      'form-element': true,
      'email-hide': true,
    });
    const passClasses = classNames({
      'form-element': true,
      pass: true,
      'pass-error': !validfield.pass,
    });
    const codeClasses = classNames({
      'form-element': true,
      pass: true,
      'pass-error': !validfield.code,
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
              <h1 className="reset-pass">
                {this.props.t[this.props.language].twoFactorAuthPage.header}
              </h1>
              <form>
                <div className={emailClasses}>
                  <label htmlFor="email">
                    {this.props.t[this.props.language].disableTwoFactorAuthPAge.email}
                  </label>
                  <h3 className="email-2fa">{email}</h3>
                </div>
                <div className={passClasses}>
                  <label htmlFor="pass">
                    {this.props.t[this.props.language].disableTwoFactorAuthPAge.pass}
                  </label>
                  <input
                    placeholder="password"
                    type="password"
                    name="pass"
                    value={pass}
                    onChange={this.onPasswordChange}
                  />
                </div>
                <div className={codeClasses}>
                  <label htmlFor="code">
                    {this.props.t[this.props.language].disableTwoFactorAuthPAge.code}
                  </label>
                  <input
                    placeholder="code"
                    type="text"
                    name="code"
                    value={code}
                    onChange={this.onCodeChange}
                  />
                </div>
                <div className={errorClass}>{errorMsg}</div>
                <div className="form-element">
                  <p className="settings-form__p">
                    {this.props.t[this.props.language].twoFactorAuthPage.note2}
                    <a className="setting-form__link" href="#" onClick={this.printSecret}>
                      {' '}
                      {this.props.t[this.props.language].twoFactorAuthPage.printLink}{' '}
                    </a>
                    {this.props.t[this.props.language].twoFactorAuthPage.note1}
                  </p>
                </div>
                <div className="form-element">
                  <input
                    id="agreement"
                    type="checkbox"
                    value="1"
                    checked={agree}
                    onChange={this.onAgreeChange}
                    name="agreement"
                  />
                  <label htmlFor="agreement">
                    {' '}
                    {this.props.t[this.props.language].twoFactorAuthPage.agree}
                  </label>
                </div>
                <div className="form-element submit">
                  <input
                    disabled={!valid}
                    type="submit"
                    value="submit"
                    className={inputClasses}
                    onClick={this.onSubmitClick}
                  />
                </div>
              </form>
            </div>
            <div className="card card-note">
              <img src={this.state.$img} alt="QCODE" />
              <p className="settings-form__p">
                {this.props.t[this.props.language].twoFactorAuthPage.key}{' '}
                <span className="red">{$secretCode}</span> <br />
                <a className="setting-form__link" href="#" onClick={this.printSecret}>
                  {' '}
                  {this.props.t[this.props.language].twoFactorAuthPage.print}
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default TwoFactorAuth;
