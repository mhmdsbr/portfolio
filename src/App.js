// App.js
import React from 'react';

import AppLayout from "./layout/AppLayout";
import ScrollToTop from "./components/UI/ScrollToTop";


function App() {
  return (
      <div className="container-fluid app">
          <AppLayout />
          <ScrollToTop />
      </div>
  );
}

export default App;

