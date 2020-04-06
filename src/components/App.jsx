import React, { Component } from 'react';

import '../css/app.scss';

import Page from './Page.jsx';

export default class App extends Component {
    render() {
        return (
            <div className='app'>
                <Page/>
            </div>
        );
    }
}