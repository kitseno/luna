import React from 'react'

import PropTypes from 'prop-types'

import Member from '../../layouts/member'

class Page extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Member>
                <div className="container mt-5">
                    <h5>Member page {this.props.user.email}</h5>
                </div>
            </Member>
        );
    }

}

Page.propTypes = {
    user: PropTypes.object.isRequired,
};

export default Page;
