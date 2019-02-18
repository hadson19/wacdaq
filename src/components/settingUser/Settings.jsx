import React, { Component } from 'react';
import { Redirect } from 'react-router'
import TwoFactorAuth from './TwoFactorAuth';
import ChangePass from './ChangePass';
import DisableTwoFactorAuth from './DisableTwoFactorAuth';


class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      active: 'pass',
      twofactor: props.authUserData['2fa']||false,
    };

    document.title = this.props.t[this.props.language].projectName + ' – Settings';
  }

  onTabClick = e => {
    //console.log(e.target.getAttribute('name'));
    const name = e.target.getAttribute('name');
    this.setState({ active: name });
  };

  componentDidMount() {
    window.scrollTo(0, 0);
  }

  setTwoFactorAuth=()=>{
      this.setState({ twofactor: true});
  }

  offTwoFactorAuth=()=>{
      this.setState({ twofactor: false });
  }

  render() {
    if (!this.props.authUserData.authorized){      
      return <Redirect to="/" />;
    }
    
      const { active, twofactor } = this.state;

    const component =
        active === 'pass' ? <ChangePass {...this.props} /> : (twofactor ? <DisableTwoFactorAuth {...this.props} goBack={this.offTwoFactorAuth}/> : <TwoFactorAuth {...this.props} goNext={this.setTwoFactorAuth}/>);


    return (
      
      <main className="start start_fees start_settings">
        <div className="settings-tabs__container">
          <ul className="tabs">
            <li
              name="pass"
              className={active === 'pass' ? 'active' : null}
              onClick={this.onTabClick}
            >
              Password
            </li>
            <li name="2fa" className={active === '2fa' ? 'active' : null} onClick={this.onTabClick}>
              2FA
            </li>
          </ul>
        </div>
        {component}
      </main>
    );
  }
}

export default Settings;
