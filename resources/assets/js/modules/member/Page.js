import React from 'react'
import {
    Segment,
    Header,
} from 'semantic-ui-react'

import {Redirect} from 'react-router-dom'
import Member from '../../layouts/member'

class Page extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Member>
                <Segment style={{minHeight: '100vh'}}>
                    <Header as='h1'>Member portal</Header>
                </Segment>
            </Member>
        );
    }
}

export default Page;
