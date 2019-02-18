import React, { Component } from 'react';
import { NavLink, Route } from 'react-router-dom';
import Project from './Project';
import axios from 'axios';
import apiLink from '../pagesRouter/environment';

export default class CoinInfo extends Component {
    state = {
        projectList: []
    }

    componentDidMount() {
        axios
            .get(`${apiLink}api/project/coininfolist`)
            .then(response => {
                this.setState({projectList: response.data}, () => {
                    if (this.props.match.isExact)
                        this.props.history.push(`/projects/${this.state.projectList[0].short_name}`);
                });
            });        
    }

    render() {
        const {projectList} = this.state;

        return (
            <div id="projects" className="page">
                <div className="wrapper">
                    <h1 className="title">COIN INFO</h1>
                    <div className="projects-menu">
                        <h3>CURRENCY</h3>
                        <ul className="projects-side-menu">
                            {projectList.map((item, index) => (
                                <li key={index}><NavLink to={`/projects/${item.short_name}`} activeClassName="selected">{item.name_coin}</NavLink></li>
                            ))}
                        </ul>
                    </div>
                    <div className="fluid-content">
                        <div className="projects-info">
                            <Route path="/projects/:id" component={Project} />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}