import React from 'react'
import PropTypes from 'prop-types'

import Admin from '../../layouts/admin'


class Page extends React.Component {
    constructor(props) {
        super(props);

        // console.log('Constructor');
        // console.log(this.props);
    }

    render() {
        // console.log('Render');
        // console.log(this);
        return (
            <Admin path={this.props.location.pathname}>
                <h4>Dashboard</h4>
            </Admin>
        );
    }
}

Page.propTypes = {
    dispatch: PropTypes.func.isRequired,
};

export default Page;
