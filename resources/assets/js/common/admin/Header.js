import React from 'react'
import PropTypes from 'prop-types'

import Navigation from '../navigation'


class PageHeader extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <nav>
              <Navigation/>
            </nav>
        );
    }
}

export default PageHeader;
