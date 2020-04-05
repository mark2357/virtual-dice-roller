import React from 'react';
import ReactDOM from 'react-dom';
import './css/index.css';

// main app
import App from './components/App.jsx';

//load font awesome icons
import { library } from '@fortawesome/fontawesome-svg-core';
import { faChevronLeft, faChevronRight, faTimes, faPlus, faMinus} from '@fortawesome/free-solid-svg-icons';
library.add(faChevronLeft, faChevronRight, faTimes, faPlus, faMinus);


ReactDOM.render(<App />, document.getElementById('app'))