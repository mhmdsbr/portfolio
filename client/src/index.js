import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import store from './store/reduxStore';
import App from './App';

import './index.scss';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { faPalette, faDesktop, faPencilRuler, faPaintbrush, faChartArea, faBullhorn } from '@fortawesome/free-solid-svg-icons';

library.add(fab, faPalette, faDesktop, faPencilRuler, faPaintbrush, faChartArea, faBullhorn);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <React.StrictMode>
        <Provider store={store}>
            <App />
        </Provider>,
    </React.StrictMode>
);
