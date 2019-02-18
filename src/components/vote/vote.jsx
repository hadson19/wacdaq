import React, { Component } from 'react';
import Counter from './counter';
import Tab1 from './tab1';
import Tab2 from './tab2';
import axios from 'axios';
import apiLink from '../pagesRouter/environment';
import Cookies from 'universal-cookie';

const cookies = new Cookies();

class vote extends Component {
  _mount = false;
  constructor(props) {
    super(props);

    this.state = {
      tab: true,
      activeTab: 0,
      myVotesBalance: 0,
      projectsList: [],
      projectsListing: [],
      votedId: null,
      votedIdError: null,
      voting: {
        active: false,
        dt_end: '',
        dt_start: '',
        goal: 0,
        id: 0,
        name: '',
      },
    };

    // this.changeTab = this.changeTab.bind(this);
    // this.getVotes = this.getVotes.bind(this);
    // this.getBalance = this.getBalance.bind(this);
  }

  changeTab = tabIndex => {
    this.setState({
      activeTab: tabIndex,
    });
  };

  componentDidMount() {
    this._mount = true;
    window.scrollTo(0, 0);

    this.getVotes();
    this.getBalance();
    this.getAllProjectsList();
  }

  componentWillUnmount() {
    this._mount = false;
  }

  getVotes = () => {
    let params = {};

    axios({
      method: 'get',
      url: apiLink + 'api/voting',
      params: params,
    })
      .then(response => {
        if (this._mount) {
          const voteId = response.data[0].id;
          cookies.set('vote_id', response.data[0].id);

          this.setState({ voteId: voteId, voting: response.data[0] }, () => {
            this.getProjectsList(voteId);
          });
        }
      })
      .catch(error => {
        // console.log(error);
      });
  };

  getProjectsList = id => {
    axios({
      method: 'get',
      url: apiLink + 'api/voting/project',
      params: {
        id: id,
      },
    })
      .then(response => {
        if (this._mount) {
          this.setState({
            projectsList: response.data,
          });
        }
      })
      .catch(error => {
        // console.log(error);
      });
  };

  getAllProjectsList = () => {
    axios({
      method: 'get',
      url: apiLink + 'api/project',
      params: {},
    })
      .then(response => {
        if (this._mount) {
          this.setState({
            projectsListing: response.data,
          });
        }
      })
      .catch(error => {
        // console.log(error);
      });
  };

  getBalance = () => {
    let $auth_key = cookies.get('userAuthKey');
    let $user_id = cookies.get('user_id');

    axios({
      method: 'get',
      url: apiLink + 'api/balances',
      params: {
        uauthkey: $auth_key,
        uid: $user_id,
      },
    })
      .then(response => {
        response.data.forEach(block => {
          if (this._mount) {
            if (block.currency.short_name === 'WCQ') {
              this.setState({
                myVotesBalance: block.freeVolume,
              });
            }
          }
        });
      })
      .catch(error => {
        // console.log('error');
      });
  };

  render() {
    let vote = this.state.voting;

    if (vote.active) {
      return (
        <section className="page-vote">
          <div className="wrapper">
            <div className="wrapper__head">
              <h1 className="tittle"> {this.props.t[this.props.language].votePage.title}</h1>
              <p>
                {this.props.t[this.props.language].votePage.note1}
                <br />
                {this.props.t[this.props.language].votePage.note2}
              </p>
              <a href="https://goo.gl/7Y52oA" target="_blank" rel="noopener noreferrer">
                {this.props.t[this.props.language].votePage.readRules}
              </a>
            </div>
            <Counter data={vote} language={this.props.language} t={this.props.t} />
            <div className="b-tabs">
              <div className="b-tabs__head">
                <span
                  onClick={() => this.changeTab(0)}
                  className={this.state.activeTab === 0 ? 'active' : ''}
                >
                  {this.props.t[this.props.language].votePage.currentRoundProject}
                </span>
                <span
                  onClick={() => this.changeTab(1)}
                  className={this.state.activeTab === 1 ? 'active' : ''}
                >
                  {this.props.t[this.props.language].votePage.projectForListing}
                </span>
                <div className="my-voyces">
                  {this.props.t[this.props.language].votePage.have}
                  <span>
                    {this.state.myVotesBalance} {this.props.t[this.props.language].votePage.votes}
                  </span>{' '}
                  {this.props.t[this.props.language].votePage.curse}
                </div>
              </div>
              <div className="b-tabs__content">
                {this.state.activeTab === 0 && (
                  <Tab1
                    goal={vote.goal}
                    projectsList={this.state.projectsList}
                    votedId={this.state.votedId}
                    voteIdError={this.state.votedIdError}
                    handleAddVote={this.addMyVote}
                    balance={this.state.myVotesBalance}
                    getVotes={this.getVotes}
                    getBalance={this.getBalance}
                    language={this.props.language}
                    t={this.props.t}
                  />
                )}
                {this.state.activeTab === 1 && (
                  <Tab2
                    projectsList={this.state.projectsList}
                    projectsListing={this.state.projectsListing}
                    language={this.props.language}
                    t={this.props.t}
                  />
                )}
              </div>
            </div>
          </div>
        </section>
      );
    } else {
      return (
        <section className="page-vote">
          <div className="b-loading" />
        </section>
      );
    }
  }
}

export default vote;
