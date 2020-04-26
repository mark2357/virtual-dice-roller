// modules
import React from 'react';

// components
import Page from './Page.jsx';
import FullScreenPanelDisplay from './FullScreenPanelDisplay.jsx';

// providers
import { FullScreenPanelProvider } from './providers/FullScreenPanelProvider.jsx';
import { PersistentDataProvider, PersistentDataContext } from './providers/PersistentDataProvider.jsx';

const PageContainer = () => {
    return (
        <div className='page-container'>
            <FullScreenPanelProvider>
                <PersistentDataProvider>
                    <PersistentDataContext.Consumer>
                        {value => (
                            <div className='font-size-wrapper' style={{ fontSize: value.settings.fontSizeMulti + 'rem' }}>
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

export default PageContainer;