import React, { Component } from 'react';

import Page from './Page.jsx';
import { FullScreenPanelProvider } from './providers/FullScreenPanelProvider.jsx';
import { PersistentDataProvider } from './providers/PersistentDataProvider.jsx';
import FullScreenPanelDisplay from './FullScreenPanelDisplay.jsx';

export default class PageContainer extends Component {
    render() {
        return (
            <div className='page-container'>
                <FullScreenPanelProvider>
                    <PersistentDataProvider>
                        <Page />
                        <FullScreenPanelDisplay />
                    </PersistentDataProvider>
                </FullScreenPanelProvider>
            </div>
        );
    }
}