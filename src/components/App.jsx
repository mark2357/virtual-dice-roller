import React, { Component } from 'react';

import '../css/app.css';

import Page from './Page.jsx';

export default class App extends Component {
    render() {
        return (
            <div className='content-container'>
                <Page/>
            </div>
        );
    }
}