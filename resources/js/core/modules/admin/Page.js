import React from 'react'

import {Redirect} from 'react-router-dom'

class Page extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
    	return <Redirect to='/admin/dashboard' replace/>
    }
}

export default Page;
