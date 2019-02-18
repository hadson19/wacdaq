import React, { Component } from 'react'
import axios from 'axios';
import { Link } from "react-router-dom";
import apiLink from '../pagesRouter/environment';


class mainPage extends Component {
	constructor(props) {
        super(props);

		this.state = {
		    amounts: {
		        day: 0,
                week: 0,
                month: 0
            }
		};
        document.title = this.props.t[this.props.language].titles.index;
        
        axios({
            method: 'GET',
            url: apiLink+'api/volume_summary',
            headers: { 'content-type': 'application/x-www-form-urlencoded' },
        })
        .then((response) => {
            this.setState({
                amounts: response.data
            })
        })
        .catch((error) => {});


    }
    
    componentDidMount() {
        window.scrollTo(0, 0);
    }
	
	render() {		
	    return <main className="start start_trading">
            <h1 className="start-title">
                { this.props.t[this.props.language].indexPage.header }
            </h1>
            <div className="start-subtitle">
                { this.props.t[this.props.language].indexPage.subheader }
            </div>
            <Link to="/start" className="start-button cursor">
                {this.props.t[this.props.language].indexPage.startTrading}
            </Link>
            <div className="start-counter">
                <div className="start-counter-item">
                    <div className="start-counter-item-volume">$ {this.state.amounts.day}</div>
                    {this.props.t[this.props.language].indexPage.dayHvolume}
                </div>
                <div className="start-counter-item">
                    <div className="start-counter-item-volume">$ {this.state.amounts.week}</div>
                    {this.props.t[this.props.language].indexPage.day7volume}
                </div>
                <div className="start-counter-item">
                    <div className="start-counter-item-volume">$ {this.state.amounts.month}</div>
                    {this.props.t[this.props.language].indexPage.day30volume}
                </div>
            </div>
        </main>;
	}
}

export default mainPage;