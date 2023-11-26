import React from 'react';
import ReactDOM from 'react-dom/client';

import './index.scss';
import "bootstrap/dist/js/bootstrap.bundle.min";
import App from './App';

import { library } from '@fortawesome/fontawesome-svg-core'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { faPalette, faDesktop, faPencilRuler, faPaintbrush, faChartArea, faBullhorn } from '@fortawesome/free-solid-svg-icons'


library.add(fab, faPalette, faDesktop, faPencilRuler, faPaintbrush, faChartArea, faBullhorn)


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
