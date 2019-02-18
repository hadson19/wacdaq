import React, { Component } from 'react';
import axios from 'axios';
import qs from 'qs';
import classNames from 'classnames';
import apiLink from '../pagesRouter/environment';
import Cookies from 'universal-cookie';

const cookies = new Cookies();
let userAuthKey = cookies.get('userAuthKey');
let user_id = cookies.get('user_id');

class ChangePass extends Component {
  constructor(props) {
    super(props);
    this.state = {
      oldpass: '',
      pass: '',
      repeatPass: '',
      validfield: {
        oldpass: true,
        pass: true,
        repeatPass: true,
      },
      formValid: false,
      successReset: false,
      errorMsg: '',
      successChange: false,
    };
    document.title = this.props.t[this.props.language].projectName + ' – Reset Password';
  }

  killMessages = () => {
    return { errorMsg: '', successChange: false };
  };

  onOldPasswordChange = e => {
    const { value } = e.target;
    const vf = this.validateOldPass(value);
    this.setState({ oldpass: value, validfield: vf, ...this.killMessages() });
  };

  validateOldPass(value) {
    const errors = { ...this.state.validfield };
    const valid = !!value;
    errors.oldpass = valid;
    return errors;
  }

  onPasswordChange = e => {
    const { value } = e.target;
    const vf = this.validatePass(value);
    this.setState({ pass: value, validfield: vf, ...this.killMessages() });
  };

  validatePass(value) {
    const errors = { ...this.state.validfield };
    const valid = !!value;
    errors.pass = valid;
    return errors;
  }

  onRepeatPasswordChange = e => {
    const { value } = e.target;
    const vf = this.validateRepeatPass(value);
    this.setState({ repeatPass: value, validfield: vf, ...this.killMessages() });
  };

  validateRepeatPass(value) {
    const errors = { ...this.state.validfield };
    const valid = !!value && value === this.state.pass;
    errors.repeatPass = valid;
    return errors;
  }

  validateForm(e) {
    const { pass, repeatPass, oldpass } = this.state;
    const valid = !Object.values(this.state.validfield).some(val => val === false);
    if (pass !== '' && repeatPass !== '' && oldpass !== '' && valid) {
      return true;
    }
    return false;
  }

  setDefaultState(stateParams = {}) {
    const valid = {
      oldpass: true,
      pass: true,
      repeatPass: true,
    };

    const _state = {
      oldpass: '',
      pass: '',
      repeatPass: '',
      validfield: valid,
      formValid: false,
      successReset: false,
    };

    this.setState({ ..._state, ...stateParams });
  }

  onSubmitClick = e => {
    e.preventDefault();
    this.resetPass();
  };

  resetPass() {
    const { oldpass, pass, repeatPass } = this.state;
    const { auth_key, id } = this.props.authUserData;
    axios({
      method: 'post',
      url: apiLink + 'resetpassprofile',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      data: qs.stringify({
        current_password: oldpass,
        pass: pass,
        pass_confirm: repeatPass,
        auth_key: auth_key,
        id_user: id,
      }),
    })
      .then(resp => {
        if (resp.status === 200) {
          const { data } = resp;
          if (data.status === 'ok') {
            this.setDefaultState({ successChange: true });
          } else {
            this.setDefaultState({ errorMsg: data.msg });
          }
        } else {
          throw new Error();
        }
      })
      .catch(error => {
        this.setDefaultState();
      });
  }

  render() {
    const { validfield, oldpass, pass, repeatPass, errorMsg, successChange } = this.state;
    const valid = this.validateForm();

    const oldpassClasses = classNames({
      'form-element': true,
      pass: true,
      'pass-error': !validfield.oldpass,
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
    const successChangeClass = successChange ? 'network-success' : 'hidden';
    return (
      <div className="settings-form">
        <div className={wrapperClasses}>
          <h1 className="reset-pass">Reset you password</h1>
          <div className={containerClasses}>
            <div className="card card-form">
              <form>
                <div className={oldpassClasses}>
                  <label htmlFor="pass">
                    {this.props.t[this.props.language].changePassPage.oldPass}
                  </label>
                  <input
                    placeholder="password"
                    type="password"
                    name="pass"
                    value={oldpass}
                    onChange={this.onOldPasswordChange}
                  />
                </div>
                <div className={passClasses}>
                  <label htmlFor="pass">
                    {this.props.t[this.props.language].changePassPage.newPass}
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
                    {this.props.t[this.props.language].changePassPage.repeatPass}
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
                <div className={successChangeClass}>Password successfully changed.</div>
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
            <div className="card card-note settings-form__p">
              <p>{this.props.t[this.props.language].changePassPage.useForm}</p>
              <p> {this.props.t[this.props.language].changePassPage.note1}</p>
              <p> {this.props.t[this.props.language].changePassPage.note2}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ChangePass;
