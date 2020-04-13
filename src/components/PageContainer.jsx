import React, { Component } from 'react';

import Page from './Page.jsx';
import { FullScreenPanelProvider } from './providers/FullScreenPanelProvider.jsx';
import { PersistentDataProvider, PersistentDataContext } from './providers/PersistentDataProvider.jsx';
import FullScreenPanelDisplay from './FullScreenPanelDisplay.jsx';

export default class PageContainer extends Component {
    render() {
        return (
            <div className='page-container'>
                <FullScreenPanelProvider>
                    <PersistentDataProvider>
                        <PersistentDataContext.Consumer>
                            {value => (
                                <div className='font-size-wrapper' style={{fontSize: value.settings.fontSizeMulti + 'rem'}}>
                                    <Page />
                                    <FullScreenPanelDisplay />
                                </div>
                                )
                            }
                    </PersistentDataContext.Consumer>
                    </PersistentDataProvider>
                </FullScreenPanelProvider>
            </div>
        );
    }
}