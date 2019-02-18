import React, { Component } from 'react'
import axios from 'axios';
import qs from 'qs';
import apiLink from '../pagesRouter/environment';

class listingForm extends Component {
	constructor(props) {
		super(props);		
		this.state = {
            formSubmitted: false,
            style: {display: "block"},
            styleHide: {display: "none"},
            name:'',
            email:'',
            subject:'',
            text:'',
            ajaxLoader: false,
		};
        document.title = this.props.t[this.props.language].projectName + " – Support";
        this.submitForm = this.submitForm.bind(this);
        this.setName = this.setName.bind(this)
        this.setEmail = this.setEmail.bind(this)
        this.setSubject = this.setSubject.bind(this)
        this.setText = this.setText.bind(this)
    }
    
    componentDidMount() {
        window.scrollTo(0, 0);
    }

    setName(event) {
        this.setState({name: event.target.value});
    }
    setEmail(event) {
        this.setState({email: event.target.value});
    }
    setSubject(event) {
        this.setState({subject: event.target.value});
    }
    setText(event) {
        this.setState({text: event.target.value});
    }
	submitForm(e) {
        e.preventDefault();
        this.setState({ajaxLoader: true});

        axios({
            method: 'POST',
            url: apiLink+'support',
            headers: { 'content-type': 'application/x-www-form-urlencoded' },
            data: qs.stringify({
                name: this.state.name,
                email: this.state.email,
                subject: this.state.subject,
                text: this.state.text
            })
        })
        .then((response) => {
            this.setState({
                ajaxLoader: false,
                formSubmitted: true
            });
        })
        .catch((error) => {});
    }
	
	render() {		
	    return <main className="start start_form">
            <h1 className="start-title">
                {this.props.t[this.props.language].supportPage.support}
            </h1>
            <div className="start-paragraph">
                {this.props.t[this.props.language].supportPage.sendFeedbackMessage}
            </div>
            <form className="start-form" name="start-form" style={this.state.formSubmitted ? this.state.styleHide : {}}>
                <input value={this.state.name} onChange={this.setName} className="start-form-input" type="text" placeholder={this.props.t[this.props.language].supportPage.yourName} />
                <input value={this.state.email} onChange={this.setEmail} className="start-form-input" type="text" placeholder={this.props.t[this.props.language].supportPage.email} />
                <input value={this.state.subject} onChange={this.setSubject} className="start-form-input" type="text" placeholder={this.props.t[this.props.language].supportPage.subject} />
                <textarea value={this.state.text} onChange={this.setText} className="start-form-input start-form-input_textarea" placeholder={this.props.t[this.props.language].supportPage.message}></textarea>
                <button onClick={(e) => this.submitForm(e)} className="start-form-button">{this.props.t[this.props.language].supportPage.send}</button>
            </form>
            <div className="ajax-loader" style={this.state.ajaxLoader ? this.state.style : {}}>
                <img src="/static/images/ajax-loader_line.gif" alt=""/>
            </div>
            <div className="start-success" style={this.state.formSubmitted ? this.state.style : {}}>{this.props.t[this.props.language].supportPage.messageSend}</div>
        </main>;
	}
}

export default listingForm;