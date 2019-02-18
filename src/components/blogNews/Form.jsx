import React, { Component } from 'react';
import axios from 'axios';
import apiLink from '../pagesRouter/environment';
import { Redirect } from 'react-router-dom';
import Datetime from "react-datetime";

export default class Form extends Component {
  state = {
    title: '',
    img: '',
    description: '',
    dt: ''
  };

  componentDidMount() {
    const { action, match } = this.props;

    if (action === 'edit') {
      axios.get(`${apiLink}api/news/${match.params.id}`, {
        params: {
          lang_id: this.props.languageId
        }
      })
        .then(response => {
          if (response.data)
            this.setState(response.data)
        });
    }
  }

  handleSubmit = (event) => {
    event.preventDefault();
    const { authUserData, languageId } = this.props;

    if (authUserData && authUserData.user_group === 3) {
      const { action, match } = this.props;
      const url = `${apiLink}api/news` + (action === 'edit' ? `/${match.params.id}` : '');

      let formData = new FormData();
      formData.append("uid", authUserData.id);
      formData.append("uauthkey", authUserData.auth_key);
      formData.append('lang_id', languageId);

      for (var key in this.state) {
        if (key === 'dt') {
          var date = new Date(this.state[key]);
          formData.append(key, date.toISOString());
        } else {
          formData.append(key, this.state[key]);  
        }     
      }

      axios.post(url, formData)
        .then(() => {
          this.props.history.push('/blog/');
        })
        .catch(error => { console.log(error) });
    }
  };

  handleDtChange = (dt) => {
    this.setState({ dt });
  }

  handleInputChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  handleDelete = () => {
    const { authUserData, match, history } = this.props;
    
    let formData = new FormData();

    formData.append("id", match.params.id);
    formData.append("uid", authUserData.id);
    formData.append("uauthkey", authUserData.auth_key);

    axios
      .post(`${apiLink}api/news/del`, formData)
      .then(() => {
        history.push("/blog/");
      })
      .catch(error => {
        console.log(error);
      });
  }

  render() {
      const {authUserData} = this.props;

      if (!authUserData || authUserData.user_group !== 3)
          return <Redirect to="/login" />;

      return <div className="container blank">
          <form className="frame" onSubmit={this.handleSubmit}>
            <p className="title">Add Article</p>
            <div className="field">
              <p className="label">Title</p>
              <div className="input">
                <input type="text" name="title" value={this.state.title} onChange={this.handleInputChange} />
              </div>
            </div>
            <div className="field">
              <p className="label">Image</p>
              <div className="input">
                <input type="text" name="img" onChange={this.handleInputChange} value={this.state.img} />
              </div>
            </div>
            <div className="field">
              <p className="label">Text</p>
              <div className="input">
                <textarea rows="6" name="description" onChange={this.handleInputChange} value={this.state.description} />
              </div>
            </div>
            <div className="field">
              <p className="label">Publish Datetime</p>
              <div className="input">
                <Datetime inputProps={{ name: "dt", autoComplete: "off" }}  onChange={this.handleDtChange} value={this.state.dt} />
              </div>
            </div>
            <div>
              <input className="btn btn-success" type="submit" value={this.props.action === "edit" ? "Edit" : "Add"} />
              {this.props.action === "edit" && <input className="btn btn-error" type="button" value="Delete" onClick={this.handleDelete} />}
            </div>
          </form>
        </div>;
  }
}
