import React from 'react';

import {
    Grid,
    Container,
} from 'semantic-ui-react'

import {connect} from 'react-redux'
import {Redirect} from 'react-router'
import PropTypes from 'prop-types'

import Header from '../../common/admin/Header'
import LeftSidebar from '../../common/admin/LeftSidebar'
import Footer from '../../common/admin/Footer'

class Admin extends React.Component {

    constructor(props) {
        super(props);
    }

    render() { 
        const {isAdmin, path} = this.props;

        if (isAdmin === false) { return <Redirect to='/' replace/> }

        return (
            <div className="wrapper">
              <Header path={path}/>
              <LeftSidebar path={path}/>
              <section className="content">
                <div className="container m-auto p-0">
                  { this.props.children }
                </div>
              </section>
              {/* <Footer/> */}
            </div>
        );

    }

}

Admin.propTypes = {
    isAdmin: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => {
    return {
        isAuthenticated : state.Auth.isAuthenticated,
        isAdmin : state.Auth.isAdmin,
    }
};

export default connect(mapStateToProps)(Admin)
