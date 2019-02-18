import React, { Component } from 'react'
import { Link } from "react-router-dom"
import axios from 'axios';
import apiLink from '../pagesRouter/environment';

class blogNews extends Component {
  state = {
    news: {}
  };

  componentDidMount() {
    window.scrollTo(0, 0);
    axios({
      method: 'get',
      url: `${apiLink}api/news/${this.props.match.params.id}`
    })
    .then((response) => {
      console.log(response.data);
      this.setState({
        news: response.data
      })
    });
  }

  render() {
    let news = this.state.news;

    return <section className="blog-list">
      <h1 className="tittle">WACDAQ <span>{this.props.t[this.props.language].blogPage.title}</span></h1>
      <article className="blog-news">
        <h2 className="tittle">{news.title}</h2>
        <div className="b-news__date">
          <i className="fa fa-calendar" aria-hidden="true"></i> {news.dt}
        </div>
        <img src={'/static/images/news/' + news.img} alt="" />
        <p dangerouslySetInnerHTML={{ __html: news.description }}></p>
        <Link to="/blog"
          className="b-news-backlink"
        >
          <i className="fa fa-long-arrow-left" aria-hidden="true"></i> {this.props.t[this.props.language].blogPage.back}
        </Link>
      </article>
    </section>;
  }
}

export default blogNews;