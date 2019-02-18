import React, { Component } from 'react';
import { Redirect } from 'react-router';

class notFound extends Component {		
	render() {
		return (
            <Redirect push to="/"/>
		);
	}
}

export default notFound;