import React from 'react';
import axios from "axios";

import AppLayout from "./layout/AppLayout";
import ScrollToTop from "./components/UI/button/ScrollToTop";

export default class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            pages: []
        };
    }

    getAllPages = async () => {
        let res = await axios.get(
            `http://portfolio.test/?rest_route=/wp/v2/pages`
        );
        let { data } = await res;

        this.setState({ pages: data });
    };

    componentDidMount = async () => {
        await this.getAllPages();
    };

    render() {
        const { pages } = this.state;

        return (
          <div className="container-fluid app">
              <AppLayout />
              <ScrollToTop />
              {pages.map((page, index) => {
                  return <h1>{page.slug}</h1>;
              })}
          </div>

        );
    }
}