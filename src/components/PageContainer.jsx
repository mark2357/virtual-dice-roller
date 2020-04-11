import React, { Component } from 'react';

import Page from './Page.jsx';

export default class PageContainer extends Component {
    render() {
        return (
            <div className='page-container'>
                <Page/>
            </div>
        );
    }
}