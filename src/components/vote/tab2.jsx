import React, { Component } from 'react'
import axios from 'axios';
import apiLink from '../pagesRouter/environment';
import Cookies from 'universal-cookie';

const cookies = new Cookies();

class ProjectListingItem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      projectDate: '-',
      votes: 0,
      myVotes: 0,
      myVotesPercent: 0,
    }
  }

  getMyVoices() {
    let user_id = cookies.get('user_id');
    let project_id = this.props.data.id;
    let id_voting = this.props.data.id_voting;

    axios({
      method: 'get',
      url: apiLink + 'api/project/uservotes',
      params: {
        id_project: project_id,
        id_user: user_id,
        id_voting: id_voting
      }
    })
      .then((response) => {
        let count;
        if (response.data.sum == null) {
          count = 0;
        } else {
          count = response.data.sum
        }

        this.setState({
          myVotes: count,
          myVotesPercent: 100 / this.props.data.sum * count
        });
      })
      .catch((error) => {
        // console.log(error);
      });
  }

  render() {
    let item = this.props.data;

    return (
      <tr>
        <td>{this.state.projectDate}</td>
        <td>{item.short_name_coin} <small>{item.name_coin}</small></td>
        <td>
          <a href={item.website} target="_blank" rel="noopener noreferrer">{item.website}</a>
        </td>
        <td>{this.state.votes}</td>
        <td>{this.state.myVotes}</td>
        <td>{this.state.myVotesPercent}%</td>
      </tr>
    )
  }
}
class Tab_2 extends Component {
  constructor(props) {
    super(props);

    this.state = {
    }
  }
  render() {
    let projects = this.props.projectsListing;

    return <div className="b-tab">
      <table>
        <thead>
          <tr>
            <th>Round date</th>
            <th>Projects</th>
            <th>Site</th>
            <th>Votes</th>
            <th>{this.props.t[this.props.language].votePage.myVotes}</th>
            <th>{this.props.t[this.props.language].votePage.myShares}</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((projectItem, index) =>
            <ProjectListingItem
              data={projectItem}
              key={index}
            />
          )}
        </tbody>
      </table>
    </div>;
  }
}

export default Tab_2