import React from 'react';

import {
    Grid,
    Container,
} from 'semantic-ui-react'
import Header from '../../common/admin/Header'

class Member extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="wrapper">
              <Header/>
              <section>
                  { this.props.children }
              </section>
            </div>
        );
    }

}

export default Member;
