import React from 'react';
import ReactDOM from 'react-dom';
import './css/index.scss';

// main app
import App from './components/App.jsx';

//load font awesome icons
import { library } from '@fortawesome/fontawesome-svg-core';
import { faChevronLeft, faChevronRight, faChevronUp, faChevronDown, faTimes, faPlus, faMinus, faEdit, faSave, faTrashAlt} from '@fortawesome/free-solid-svg-icons';
library.add(faChevronLeft, faChevronRight, faChevronUp, faChevronDown, faTimes, faPlus, faMinus, faEdit, faSave, faTrashAlt);

//setup service worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js').then(registration => {
            console.log('SW registered: ', registration);
        }).catch(registrationError => {
            console.log('SW registration failed: ', registrationError);
        });
    });
}
else console.log('SW registration failed, no service worker in navigator');


ReactDOM.render(<App />, document.getElementById('app'));