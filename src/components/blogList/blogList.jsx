import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import apiLink from '../pagesRouter/environment';
import classNames from 'classnames';

class BlogItem extends Component {
  constructor(props) {
    super(props);

    document.title = 'WACDAQ - Blog';
  }

  render() {
    const { data, authUserData } = this.props;
    // @oldfox при готовом дизайне первый класс меняем на нужный.
    // const liclass = data.is_main ? 'b-bloglist-item' : 'b-bloglist-item';

    const blogItemClass = classNames({
      "b-bloglist-item": true,
      "b-bloglist-item_main": data.is_main
    });

    return (
      <li className={blogItemClass}>
        <div className="b-bloglist-item__img">
          <img src={'/static/images/news/' + data.img} alt="" />
        </div>
        <div className="b-bloglist-item__desc">
          <h2>{data.title}</h2>
          <p dangerouslySetInnerHTML={{ __html: data.description }}></p>
          <div className="b-bloglist-item__desc-footer">
            <span>{data.dt}</span>
            <Link to={`/blog/${data.id}`}
              className="b-news-link"
            >
              {this.props.t[this.props.language].blogPage.readMore} <i className="fa fa-long-arrow-right" aria-hidden="true"></i>
            </Link>
            {authUserData && authUserData.user_group === 3 ?
              <Link to={`/blog/edit/${data.id}`} className="b-news-link" style={{ marginRight: 10 }}>Edit News</Link>
              : null
            }
          </div></div>
      </li>
    );
  }
}

class blogList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      newsList: [],
    };
  }

  componentDidMount() {
    window.scrollTo(0, 0);

    this.getNews();
  }

  componentDidUpdate(prevProps) {
    if (this.props.languageId !== prevProps.languageId) {
      this.getNews();
    }
  }

  getNews() {
    axios({
      method: 'get',
      url: apiLink + 'api/news',
      params: {
        lang_id: this.props.languageId,
      },
    })
      .then(response => {
        this.setState({
          newsList: response.data,
        });
      })
      .catch(response => {
        // console.log(response);
      });
  }

  render() {
    let news = this.state.newsList;
    const { authUserData } = this.props;

    return <section className="blog-list">
      <h1 className="tittle">WACDAQ <span>{this.props.t[this.props.language].blogPage.title}</span></h1>
      {/* <h1 className="tittle">WACDAQ - Blog</h1> */}
      <div className="blog-list__inner">
        {authUserData && authUserData.user_group === 3 ? 
          <Link to="/blog/add" className="btn btn-success" style={{marginBottom: 20}}>Add News</Link>
          : null
        }
        
        <ul className="b-bloglist">
          {news.map((newsItem, index) =>
            <BlogItem data={newsItem} key={index} {...this.props}/>
          )}
        </ul>
      </div>
    </section>;
  }
}

export default blogList;
