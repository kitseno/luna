import React from 'react'

import {Link} from 'react-router-dom'

import Web from '../../layouts/web'

class Page extends React.Component {

    render() {
        return (
            <Web path={this.props.location.pathname}>
                  <main role="main" className="pl-3 pr-3 d-flex" style={{height: '400px'}}>
                    <div className="align-self-center">
                        <h4 className="mb-0">
                            About page
                        </h4>
                    </div>
                  </main>
            </Web>
        );
    }
}

export default Page;
