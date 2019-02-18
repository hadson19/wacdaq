import React, { Component } from 'react';
import axios from 'axios';
import apiLink from '../pagesRouter/environment';
import { Link } from "react-router-dom"

class VoteItemData extends Component {
  constructor(props) {
    super(props);

    this.state = {
    }
  } 
  render() {
    let item = this.props.data;

    return (
      <li>
        <div>
          <span>
            name:
          </span>
          {item.name_coin}
        </div>
        <div>
          <span>Icons</span>
          <img src={item.icons} alt={item.name_coin}/>
        </div>
        <div>
          <span>bitcointalk:</span>
          {item.bitcointalk}
        </div>
        <div>
          <span>manager_nick:</span>
          {item.manager_nick}
        </div>
        <div>
          <span>email:</span>
          {item.email}
        </div>
        <div>
          <span>coinmarketcap:</span>
          {item.coinmarketcap}
        </div>
        <div>
          <span>contract_address:</span>
          {item.contract_address}
        </div>
        <div>
          <span>facebook:</span>
          {item.facebook}
        </div>
        <div>
          <span>github_source:</span>
          {item.github_source}
        </div>
        <div>
          <span>telegram_comm:</span>
          {item.telegram_comm}
        </div>
        <div>
          <span>website:</span>
          {item.website}
        </div>
      </li>
    );
  }
}

class voteItem extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      project: []
    }
  } 

  componentDidMount() {
    let id = localStorage.getItem('projectId');

    window.scrollTo(0, 0);
    this.getProject(id);
  }

  componentWillUnmount() {
  }

  getProject = (count) => {
    axios({
      method: 'get',
      url: apiLink + 'api/voting/project',
      params: {
        id: count
      }
    })
      .then((response) => {
        this.setState({
          project: response.data
        });
      })
      .catch((error) => {
        // console.log(error);
      });
  }

  onClickBack() {
    localStorage.removeItem('projectId');
  }

  render() {
    let item = this.state.project;

    return (
      <section className="page-vote">
        <div className="wrapper">
          <div className="wrapper__head">
            {/* <h1 className="tittle">{item.name_coin}</h1> */}
            <h1 className="tittle">Project</h1>
            <ul className="project__detail">
                {item.map((itemData, index) =>
                  <VoteItemData
                    data={itemData}
                    key={index}
                  />
                )}
              </ul>
            <Link to="/vote"
              className="b-news-backlink"
              onClick={() => this.onClickBack()}>
              <i className="fa fa-long-arrow-left" aria-hidden="true"></i> Back
            </Link>
          </div>
        </div>
      </section>
    );
  }
}

export default voteItem;