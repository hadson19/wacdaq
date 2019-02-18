import React, { Component } from 'react'
import { Link } from "react-router-dom"
import createBrowserHistory from 'history/createBrowserHistory'
import classNames from 'classnames'

class header extends Component {
	constructor(props) {
        super(props);

		this.state = {
        };		
        
        this.logout = this.logout.bind(this);
	}
	
	componentDidMount() {
        
    }
    
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

	    return <div className={headerClass}>
            <div className="container">
                <Link to="/" className="header-logo"></Link>
                <div className="header-language">
                    <div className={"header-language-current header-language-current_" + this.props.language.toLowerCase()}>
                        {this.props.language}
                    </div>
                    <div className="header-language-list">
                        <div onClick={() => this.props.setLanguage("EN")} style={this.props.language !== 'EN' ? {} : { display: 'none' }} className="header-language-list-item header-language-list-item_en">
                            EN
                        </div>
                        <div onClick={() => this.props.setLanguage("CHN")} style={this.props.language !== 'CHN' ? {} : { display: 'none' }}  className="header-language-list-item header-language-list-item_chn">
                            CHN
                        </div>
                    </div>
                </div>
                {this.props.authUserData && this.props.authUserData.authorized ? (
                    <div className="header-loginLink header-authorizedUser">
                        <span className="header-user-email">{this.props.authUserData.email}</span>
                        <div className="sub_block">
                            <div className="angle-wrapper"></div>
                            <div className="inner">
                                <ul className="sub_menu">
                                    <li>{this.props.t[this.props.language].header.profile}</li>
                                    <li><Link to="/setting">{this.props.t[this.props.language].header.setting}</Link></li>
                                    <li><Link to="/finance">{this.props.t[this.props.language].header.finance}</Link></li>
                                    <li><Link to="/history">{this.props.t[this.props.language].header.history}</Link></li>
                                    <li><Link to="/login" onClick={this.logout}>{this.props.t[this.props.language].header.logout}</Link></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                ) : (
                    <Link to="/login" className="header-loginLink">
                        <span>{this.props.t[this.props.language].header.loginRegistration}</span>
                    </Link>
                )}
                <div className="header-menu">
                    <Link to="/exchange" className="header-menu-item">{this.props.t[this.props.language].header.exchange}</Link>
                    <Link to="/listing" className="header-menu-item">{this.props.t[this.props.language].header.listing}</Link>
                    <Link to="/vote" className="header-menu-item">{this.props.t[this.props.language].header.vote}</Link>
                </div>
            </div>
        </div>;
	}
}

export default header;