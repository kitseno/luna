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

        if (isAdmin === false) { return <Redirect to='/m/username' replace/> }

        return (
            <div className="wrapper">
              <Header path={path}/>
              <LeftSidebar path={path}/>
              <section className="content" style={{
                position: 'relative',
                left: '0',
                marginLeft: '230px',
                minHeight: '100%',
                padding: '25px'
              }}>
                  { this.props.children }
              </section>
              <Footer/>
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
