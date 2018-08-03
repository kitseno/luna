import React from 'react';

import Header from '../../common/web/Header'
import Footer from '../../common/web/Footer'

class Web extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="wrapper">
              <div className="container">
                <Header path={this.props.path}/>
                <section>
                    { this.props.children }
                </section>
              </div>
              <Footer/>
            </div>
        );
    }

}

export default Web;
