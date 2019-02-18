import React, { Component } from 'react';
import Cookies from 'universal-cookie';
import axios from 'axios';
import qs from 'qs';
import apiLink from '../pagesRouter/environment';

const cookies = new Cookies();

class ConfirmWithdrawal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      code: '',
      codevalid: true,
      active: true
    };
  }

  onCodeChange = e => {
    const { value } = e.target;
    let { code, codevalid } = this.state;
    code = value;
    codevalid = value !== '';

    this.setState({ code, codevalid });
  };

  onCancelClick = e => {
    e.preventDefault();
    console.log('close');
    this.setState({code:'', codevalid: true, active:false}, ()=>{this.props.closePopup(false)});
  };

  onSubmitClick = e => {
    e.preventDefault();
    if (!this.state.codevalid) {
      return;
    }

    const { code } = this.state;
    const userAuthKey = cookies.get('userAuthKey');
    const user_id = cookies.get('user_id');

    axios({
      method: 'post',
      url: apiLink + 'checkgauth',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      data: qs.stringify({
        auth_key: userAuthKey,
        id_user: user_id,
        code: code,
      }),
    })
      .then(resp => {
        if (resp.status === 200) {
          const { data } = resp;
          if (data.status === 'ok') {
              this.setState({ code: '', codevalid: true, active: false }, () => { this.props.closePopup(true) });
          } else {
            throw new Error();
          }
        } else {
          throw new Error();
        }
      })
      .catch(err => {
        console.log(err);
        this.setState({ code: '', codevalid: false });
      });
  };

  render() {
    const { code, codevalid, active } = this.state;
    const disabled = code !== '' && codevalid;
    const errorClass = codevalid
      ? 'withdraw-confirm-popup__codeinput'
      : 'withdraw-confirm-popup__codeinput withdraw-confirm-popup__codeinput-error';
      const containerClass = active ? 'withdraw-container' : 'withdraw-container hidden'
    return (
        <section className={containerClass} >
        <article className="withdraw-confirm-popup">
          <div className="withdraw-confirm-popup__header">
            <h1>CONFIRM WITHDRAWAL</h1>
            <p className="withdraw-confirm-popup__note">
              Please enter ypu six-digit Google Authentication code.
            </p>
          </div>
          <div className="withdraw-confirm-popup__form">
            <input
              value={code}
              onChange={this.onCodeChange}
              type="text"
              name="code"
              className={errorClass}
            />
            <input
              disabled={!disabled}
              type="submit"
              value="ОТПРАВИТЬ"
              className="withdraw-confirm-popup__submit"
              onClick={this.onSubmitClick}
            />
            <input type="submit" value="Cancel" className="withdraw-confirm-popup__cancel" onClick={this.onCancelClick}/>
          </div>
        </article>
      </section>
    );
  }
}

export default ConfirmWithdrawal;
