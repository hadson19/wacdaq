import React, { Component } from 'react'
import axios from 'axios';
import apiLink from '../pagesRouter/environment';
import Cookies from 'universal-cookie';

const cookies = new Cookies();

class ConfirmEmail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      success: false,
      email: '',

    }
  }

  componentDidMount() {
    window.scrollTo(0, 0);

    const $url = document.URL;
    const $code = $url.split('#')[1];

    axios({
      method: 'get',
      url: apiLink+'user/confirmemail',
      params: {
        confirm_code: $code
      }
    })
    .then((response) => {
        this.setState({
          success: true
        });

        setTimeout(() => {
          cookies.set('userAuthKey', response.data.userData.auth_key, { path: '/' });
          cookies.set('user_id', response.data.userData.id, { path: '/' });
          cookies.set('user_email', response.data.userData.email, { path: '/' });
          window.location.href = "/exchange";
        }, 3000);
    })
    .catch((response) => {
        // console.log(response);
    });
  }

  render() {
    return (
      <section className="confirm_email">
        <div className={this.state.success ? 'active' : 'load'}>
          <h1>
            Thank you! Your email is Confirmed!
          </h1>
        </div>
      </section>
    )
  }
}

export default ConfirmEmail;