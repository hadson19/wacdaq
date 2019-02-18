import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import apiLink from "../pagesRouter/environment";
import Cookies from "universal-cookie";
import classNames from "classnames";
import qs from 'qs';

const cookies = new Cookies();

class ProjectItem extends Component {
  _mount = false;
  constructor(props) {
    super(props);

    this.state = {
      percent: (100 / this.props.goal) * this.props.data.v_sum,
      myVotes: 0,
      myVotesPercent: 0,
      voteAmount: 1,
      isVoted: false,
      isVotedError: false,
      timers: []
    };
  }

  componentWillUnmount(){
    this._mount = false;
    this.state.timers.forEach(timer=>{ clearTimeout(timer); });
  }

  componentDidMount() {
    this._mount = true;
    this.getMyVoices();
  }

  componentDidUpdate() {
    if (this.state.isVoted) {
      const timer = setTimeout(() => {
        this.setState({ isVoted: false });
      }, 3000);
      this.state.timers.push(timer);
    }

    if (this.state.isVotedError) {
      const timer = setTimeout(() => {
        this.setState({ isVotedError: false });
      }, 3000);
      this.state.timers.push(timer);
    }
  }

  getMyVoices() {
    const id_user = cookies.get("user_id");
    const id_project = this.props.data.id;
    const id_voting = this.props.data.id_voting;

    axios({
      method: "get",
      url: apiLink + "api/project/uservotes",
      params: {
        id_project,
        id_user,
        id_voting
      }
    })
      .then(response => {
        let count;
        if (response.data.sum == null) {
          count = 0;
        } else {
          count = response.data.sum;
        }

        if(this._mount){
          this.setState({
            myVotes: count,
            myVotesPercent: count > 0 ? (100 / this.props.data.v_sum) * count : 0
          });
        }        
      })
      .catch(error => {
        // console.log(error);
      });
  }

  setAmountVote = event => {
    this.setState({
      voteAmount: event.target.value
    });
  };

  handleAddVote = () => {
    if (this.state.voteAmount > this.props.balance) {
      this.setState({ isVotedError: true });
    } else {
      const id_user = cookies.get("user_id");

      axios({
        method: "post",
        url: apiLink + "api/user_vote/add",
        headers: { "content-type": "application/x-www-form-urlencoded" },
        data: qs.stringify({
          id_project: this.props.data.id,
          id_voting: this.props.data.id_voting,
          id_user,
          votes_amount: this.state.voteAmount
        })
      })
        .then(() => {
          if (this._mount) {
            this.setState({ isVoted: true });
            this.props.getBalance();
            this.props.getVotes();
            this.getMyVoices();
          }          
        })
        .catch(error => {
          // console.log(error);
        });
    }
  }

  onClickMore(id) {
    localStorage.setItem("projectId", JSON.stringify(id));
  }

  render() {
    let projectItem = this.props.data;

    const className = classNames({
      "vote-success": true,
      "addvote-success": this.state.isVoted
    });

    const classNameError = classNames({
      "vote-success-error": true,
      "addvote-success-error": this.state.isVotedError
    });

    return (
      <div className="b-tab" id={"tab-" + this.props.data.id}>
        <table className="b-coin">
          <tbody>
            <tr>
              <td className="b-coin__logo">
                <img
                  src={"/static/images/coins_logo/" + this.props.data.icons}
                  alt=""
                />
              </td>
              <td className="b-coin__title">
                <Link
                  to={`/projects/${this.props.data.short_name_coin}`}
                  className="companyName"
                  onClick={() => this.onClickMore(this.props.data.id)}
                >
                  {projectItem.short_name_coin}
                </Link>
                <small>{projectItem.name_coin}</small>
                <a
                  href={projectItem.website}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {projectItem.website}
                </a>
              </td>
              <td className="b-coin__slider">
                <ul className="title">
                  <li>{this.props.t[this.props.language].votePage.voitProgress}</li>
                  <li>{this.props.t[this.props.language].votePage.targetVotes}</li>
                </ul>
                <div className="range">
                  <div
                    className="range__progress"
                    style={{ width: this.state.percent.toFixed(2) + "%" }}
                  />
                </div>
                <ul className="total_amout">
                  <li>
                    {projectItem.v_sum} ({this.state.percent.toFixed(2)}%)
                  </li>
                  <li>{this.props.goal}</li>
                </ul>
              </td>
              <td className="b-coin__votes">
                <span className="name_votes">{this.props.t[this.props.language].votePage.vote}:</span>
                <input
                  type="text"
                  defaultValue="1"
                  onChange={this.setAmountVote}
                />
                <button type="submit" onClick={this.handleAddVote}>
                  {this.props.t[this.props.language].votePage.vote}
                </button>
                <div className={className}>Your vote has been counted</div>
                <div className={classNameError}>Not enough votes</div>
              </td>
            </tr>
          </tbody>
        </table>
        <ul className="b-coin-footer">
          <li>{this.props.t[this.props.language].votePage.raank} {projectItem.rank}</li>
          <li>
            {this.props.t[this.props.language].votePage.myVotes}: <span>{this.state.myVotes}</span>
          </li>
          <li>
            {this.props.t[this.props.language].votePage.myShares}: <span>{this.state.myVotesPercent.toFixed(2)}%</span>
          </li>
        </ul>
      </div>
    );
  }
}
class Tab_1 extends Component {
  render() {
    let projects = this.props.projectsList;

    return (
      <div className="inner">
        {projects.map((projectItem, index) => (
          <ProjectItem
            data={projectItem}
            key={index}
            index={index}
            goal={this.props.goal}
            balance={this.props.balance}
            getBalance={this.props.getBalance}
            getVotes={this.props.getVotes}
            language={this.props.language} 
            t={this.props.t}
          />
        ))}
      </div>
    );
  }
}

export default Tab_1;
