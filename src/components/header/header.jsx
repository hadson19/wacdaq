import React, { Component } from 'react'
import { Link } from "react-router-dom"
import createBrowserHistory from 'history/createBrowserHistory'
import classNames from 'classnames'

class header extends Component {
	constructor(props) {
    super(props);
		this.state = {};
    this.logout = this.logout.bind(this);
	}
	
	componentDidMount() {}
    
  logout() {
    this.props.logout();
  }

	render() {

    const customHistory = createBrowserHistory();

    let headerClass = ['header', 'header_start'];

    if (['/', '/listing', '/listing-form', '/support', '/fees', '/finance', '/history', '/vote'].indexOf(customHistory.location.pathname) !== -1)
    {
       headerClass.push('header_transparent');
    }

    headerClass = classNames(headerClass);
    return (
      <header className="header section" aria-label="Header site">
        <div className="container header__container">
          <div className="logo header__logo" itemType="http://schema.org/ImageObject">
            <Link to="/">
              <svg width="117" height="42" viewBox="0 0 117 42" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect y="39" width="69" height="3" rx="1.5" fill="url(#paint0_linear)"/>
                <rect x="74" y="39" width="3" height="3" rx="1.5" fill="url(#paint1_linear)"/>
                <rect x="83" y="39" width="3" height="3" rx="1.5" fill="url(#paint2_linear)"/>
                <rect x="92" y="39" width="3" height="3" rx="1.5" fill="url(#paint3_linear)"/>
                <rect x="98" y="39" width="3" height="3" rx="1.5" fill="url(#paint4_linear)"/>
                <rect x="103" y="39" width="3" height="3" rx="1.5" fill="url(#paint5_linear)"/>
                <rect x="108" y="39" width="3" height="3" rx="1.5" fill="url(#paint6_linear)"/>
                <rect x="113" y="39" width="3" height="3" rx="1.5" fill="url(#paint7_linear)"/>
                <path d="M17.28 23L17.256 12.92L12.312 21.224H10.56L5.64 13.136V23H1.992V6.2H5.208L11.496 16.64L17.688 6.2H20.88L20.928 23H17.28ZM35.9779 19.4H28.1779L26.6899 23H22.7059L30.1939 6.2H34.0339L41.5459 23H37.4659L35.9779 19.4ZM34.7539 16.448L32.0899 10.016L29.4259 16.448H34.7539ZM51.0945 23.288C49.3825 23.288 47.8305 22.92 46.4385 22.184C45.0625 21.432 43.9745 20.4 43.1745 19.088C42.3905 17.76 41.9985 16.264 41.9985 14.6C41.9985 12.936 42.3905 11.448 43.1745 10.136C43.9745 8.808 45.0625 7.776 46.4385 7.04C47.8305 6.288 49.3905 5.912 51.1185 5.912C52.5745 5.912 53.8865 6.168 55.0545 6.68C56.2385 7.192 57.2305 7.928 58.0305 8.888L55.5345 11.192C54.3985 9.88 52.9905 9.224 51.3105 9.224C50.2705 9.224 49.3425 9.456 48.5265 9.92C47.7105 10.368 47.0705 11 46.6065 11.816C46.1585 12.632 45.9345 13.56 45.9345 14.6C45.9345 15.64 46.1585 16.568 46.6065 17.384C47.0705 18.2 47.7105 18.84 48.5265 19.304C49.3425 19.752 50.2705 19.976 51.3105 19.976C52.9905 19.976 54.3985 19.312 55.5345 17.984L58.0305 20.288C57.2305 21.264 56.2385 22.008 55.0545 22.52C53.8705 23.032 52.5505 23.288 51.0945 23.288ZM60.6561 6.2H68.2881C70.1121 6.2 71.7201 6.552 73.1121 7.256C74.5201 7.944 75.6081 8.92 76.3761 10.184C77.1601 11.448 77.5521 12.92 77.5521 14.6C77.5521 16.28 77.1601 17.752 76.3761 19.016C75.6081 20.28 74.5201 21.264 73.1121 21.968C71.7201 22.656 70.1121 23 68.2881 23H60.6561V6.2ZM68.0961 19.808C69.7761 19.808 71.1121 19.344 72.1041 18.416C73.1121 17.472 73.6161 16.2 73.6161 14.6C73.6161 13 73.1121 11.736 72.1041 10.808C71.1121 9.864 69.7761 9.392 68.0961 9.392H64.5441V19.808H68.0961ZM91.3138 19.4H83.5138L82.0258 23H78.0418L85.5298 6.2H89.3698L96.8818 23H92.8018L91.3138 19.4ZM90.0898 16.448L87.4258 10.016L84.7618 16.448H90.0898ZM116.558 24.8C116.014 25.472 115.35 25.984 114.566 26.336C113.798 26.688 112.95 26.864 112.022 26.864C110.774 26.864 109.646 26.592 108.638 26.048C107.63 25.52 106.478 24.576 105.182 23.216C103.662 23.024 102.302 22.536 101.102 21.752C99.9184 20.968 98.9904 19.96 98.3184 18.728C97.6624 17.48 97.3344 16.104 97.3344 14.6C97.3344 12.952 97.7264 11.472 98.5104 10.16C99.3104 8.832 100.406 7.792 101.798 7.04C103.206 6.288 104.782 5.912 106.526 5.912C108.27 5.912 109.838 6.288 111.23 7.04C112.622 7.792 113.718 8.832 114.518 10.16C115.318 11.472 115.718 12.952 115.718 14.6C115.718 16.552 115.166 18.264 114.062 19.736C112.974 21.208 111.526 22.232 109.718 22.808C110.118 23.224 110.502 23.52 110.87 23.696C111.254 23.888 111.662 23.984 112.094 23.984C113.134 23.984 114.046 23.568 114.83 22.736L116.558 24.8ZM101.27 14.6C101.27 15.64 101.494 16.568 101.942 17.384C102.406 18.2 103.038 18.84 103.838 19.304C104.638 19.752 105.534 19.976 106.526 19.976C107.518 19.976 108.414 19.752 109.214 19.304C110.014 18.84 110.638 18.2 111.086 17.384C111.55 16.568 111.782 15.64 111.782 14.6C111.782 13.56 111.55 12.632 111.086 11.816C110.638 11 110.014 10.368 109.214 9.92C108.414 9.456 107.518 9.224 106.526 9.224C105.534 9.224 104.638 9.456 103.838 9.92C103.038 10.368 102.406 11 101.942 11.816C101.494 12.632 101.27 13.56 101.27 14.6Z" fill="white"/>
                <defs>
                  <linearGradient id="paint0_linear" x1="7.11905" y1="40.5238" x2="53.4841" y2="40.4886" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#FFC541"/>
                    <stop offset="1" stopColor="#F99A24"/>
                  </linearGradient>
                  <linearGradient id="paint1_linear" x1="74.3095" y1="40.5238" x2="76.3254" y2="40.5237" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#FFC541"/>
                    <stop offset="1" stopColor="#F99A24"/>
                  </linearGradient>
                  <linearGradient id="paint2_linear" x1="83.3095" y1="40.5238" x2="85.3254" y2="40.5237" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#FFC541"/>
                    <stop offset="1" stopColor="#F99A24"/>
                  </linearGradient>
                  <linearGradient id="paint3_linear" x1="92.3095" y1="40.5238" x2="94.3254" y2="40.5237" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#FFC541"/>
                    <stop offset="1" stopColor="#F99A24"/>
                  </linearGradient>
                  <linearGradient id="paint4_linear" x1="98.3095" y1="40.5238" x2="100.325" y2="40.5237" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#FFC541"/>
                    <stop offset="1" stopColor="#F99A24"/>
                  </linearGradient>
                  <linearGradient id="paint5_linear" x1="103.31" y1="40.5238" x2="105.325" y2="40.5237" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#FFC541"/>
                    <stop offset="1" stopColor="#F99A24"/>
                  </linearGradient>
                  <linearGradient id="paint6_linear" x1="108.31" y1="40.5238" x2="110.325" y2="40.5237" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#FFC541"/>
                    <stop offset="1" stopColor="#F99A24"/>
                  </linearGradient>
                  <linearGradient id="paint7_linear" x1="113.31" y1="40.5238" x2="115.325" y2="40.5237" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#FFC541"/>
                    <stop offset="1" stopColor="#F99A24"/>
                  </linearGradient>
                </defs>
              </svg>
            </Link>
          </div>
          <nav className="header-nav header__header-nav" aria-label="Header navigation">
            <Link to="/exchange" className="header-nav__link">{this.props.t[this.props.language].header.exchange}</Link>
            <Link to="/listing" className="header-nav__link">{this.props.t[this.props.language].header.listing}</Link>
          </nav>
          <div className="authorization header__authorization" aria-label="Link login and register">
            <Link to="/login" className="authorization__item">Login</Link>
            {' or '}
            <Link to="/login" className="authorization__item">Register</Link>
          </div>
          <div className="change-language header__change-language" role="radiogroup" aria-label="Change language">
            <select id="language" className="select-language">
              <option value="1" data-foo="bar">En</option>
              <option value="2" data-foo="bar">Br</option>
              <option value="3" data-foo="bar">Es</option>
            </select>
          </div>
        </div>
      </header>
    );
    // return (
    //   <div className={headerClass}>
    //     <div className="container">
    //       <Link to="/" className="header-logo"></Link>
    //       <div className="header-language">
    //         <div className={"header-language-current header-language-current_" + this.props.language.toLowerCase()}>
    //           {this.props.language}
    //         </div>
    //         <div className="header-language-list">
    //           <div onClick={() => this.props.setLanguage("EN")} style={this.props.language !== 'EN' ? {} : { display: 'none' }} className="header-language-list-item header-language-list-item_en">
    //             EN
    //           </div>
    //           <div onClick={() => this.props.setLanguage("CHN")} style={this.props.language !== 'CHN' ? {} : { display: 'none' }}  className="header-language-list-item header-language-list-item_chn">
    //             CHN
    //           </div>
    //         </div>
    //       </div>
    //       {this.props.authUserData && this.props.authUserData.authorized ? (
    //         <div className="header-loginLink header-authorizedUser">
    //           <span className="header-user-email">{this.props.authUserData.email}</span>
    //           <div className="sub_block">
    //             <div className="angle-wrapper"></div>
    //             <div className="inner">
    //               <ul className="sub_menu">
    //                 <li>{this.props.t[this.props.language].header.profile}</li>
    //                 <li><Link to="/setting">{this.props.t[this.props.language].header.setting}</Link></li>
    //                 <li><Link to="/finance">{this.props.t[this.props.language].header.finance}</Link></li>
    //                 <li><Link to="/history">{this.props.t[this.props.language].header.history}</Link></li>
    //                 <li><Link to="/login" onClick={this.logout}>{this.props.t[this.props.language].header.logout}</Link></li>
    //               </ul>
    //             </div>
    //           </div>
    //         </div>
    //       ) : (
    //         <Link to="/login" className="header-loginLink">
    //           <span>{this.props.t[this.props.language].header.loginRegistration}</span>
    //         </Link>
    //       )}
    //       <div className="header-menu">
    //         <Link to="/exchange" className="header-menu-item">{this.props.t[this.props.language].header.exchange}</Link>
    //         <Link to="/listing" className="header-menu-item">{this.props.t[this.props.language].header.listing}</Link>
    //         <Link to="/vote" className="header-menu-item">{this.props.t[this.props.language].header.vote}</Link>
    //       </div>
    //     </div>
    //   </div>
    // );
	}
}

export default header;