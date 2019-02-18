import React, { Component } from 'react'
import { Redirect } from 'react-router';

export default class startTrading extends Component {
    render() {
        const {authUserData} = this.props;

        if (!authUserData || !authUserData.authorized) return <Redirect to="/login/" />;

        return <Redirect to="/exchange/" />;
    }
}
