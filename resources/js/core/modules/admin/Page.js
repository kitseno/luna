import React from 'react'

import {Redirect} from 'react-router-dom'
import Admin from '../../layouts/admin'

class Page extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
    	return <Redirect to='/admin/dashboard' replace/>
    }
}

export default Page;
