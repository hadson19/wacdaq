import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import apiLink from "../pagesRouter/environment";

class footer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      serverTime: '',
      online: '',
    };
    this.dtInterval = null;
  }

  componentDidMount() {
    this.updateServerStatus();

    this.dtInterval = setInterval(() => {
      this.updateServerStatus();
    }, 10000);
  }

  componentWillUnmount() {
    clearInterval(this.dtInterval);
  }

  updateServerStatus() {
    axios
      .get(`${apiLink}api/server_status`)
      .then(response => {
        let dt = response.data.time.split(" ");
        this.setState({ 
          serverTime: dt[0] + ' ' + dt[1], 
          online: response.data.users, 
          company: response.data.company
        });
      })
      .catch(error => {
        console.error(error);
      });
  }

  render() {
    let { serverTime, online, company } = this.state;

    return <div className="footer">
        <div className="container">
          <Link to="/" className="footer-logo" />
          <div className="footer-right">
            <div className="footer-menu">
              <Link to="/fees" className="footer-menu-item">
                {this.props.t[this.props.language].footer.fees}
              </Link>
              <Link to="/blog" className="footer-menu-item">
                {this.props.t[this.props.language].footer.blog}
              </Link>
              <Link to="/support" className="footer-menu-item">
                {this.props.t[this.props.language].footer.support}
              </Link>
            </div>
            <div className="footer-status">
              <p>{this.props.t[this.props.language].footer.serverTime}: <span>{serverTime}</span> UTC</p>
              <p>{this.props.t[this.props.language].footer.online}: <span>{online}</span></p>
            <p>{this.props.t[this.props.language].footer.company}</p>
            </div>
          </div>
          <div className="footer-socials">
            <div className="footer-socials-title">
              {this.props.t[this.props.language].footer.ourSocials}
            </div>

            <div className="footer-socials-list">
              <a target="_blank" rel="noopener noreferrer" href="https://www.facebook.com/Wacdaq-297048717792768/?modal=admin_todo_tour" className="footer-socials-list-item footer-socials-list-item_fb">
                {}
              </a>
              <a target="_blank" rel="noopener noreferrer" href="https://twitter.com/wacdaq" className="footer-socials-list-item footer-socials-list-item_twitter">
                {}
              </a>
              <a target="_blank" rel="noopener noreferrer" href="https://t.me/wacdaqofficial" className="footer-socials-list-item footer-socials-list-item_telegram">
                {}
              </a>
              <a target="_blank" rel="noopener noreferrer" href="https://github.com/wacdaq/wacdaq" className="footer-socials-list-item footer-socials-list-item_github">
                {}
              </a>
              <a target="_blank" rel="noopener noreferrer" href="https://medium.com/@wacdaqofficial" className="footer-socials-list-item footer-socials-list-item_medium">
                {}
              </a>
              <a target="_blank" rel="noopener noreferrer" href="https://www.reddit.com/user/Wacdaq" className="footer-socials-list-item footer-socials-list-item_reddit">
                {}
              </a>
              <a target="_blank" rel="noopener noreferrer" href="https://wacdaq.slack.com" className="footer-socials-list-item footer-socials-list-item_slack">
                {}
              </a>
            </div>
          </div>
        </div>
      </div>;
  }
}

export default footer;
