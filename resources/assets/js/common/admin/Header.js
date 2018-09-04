import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { APP } from '../constants'

import Navigation from '../navigation'


class PageHeader extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="admin-header d-flex flex-wrap flex-row">
                <div className="admin-brand bg-dark d-none d-sm-flex align-content-center flex-wrap" style={{'flex': '0 1 230px'}}>
                    <Link className="navbar-brand text-white align-self-center" to="/admin"><i className={"mr-3 fas fa-"+APP.PANEL_ICON+" fa-xs"} style={{transform:'rotate(-69deg)'}}></i>{APP.PANEL}</Link>
                </div>
                <Navigation/>
            </div>
        );
    }
}

export default PageHeader;
