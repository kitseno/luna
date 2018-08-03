import React from 'react'
import {
    Button,
    Container,
    Grid,
    Header,
    Icon,
    Responsive,
    Segment,
    Step
} from 'semantic-ui-react'
import Admin from '../../layouts/admin'

class Page extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Admin path={this.props.location.pathname}>
                <Header as='h3'>Settings</Header>
            </Admin>
        );
    }
}

export default Page;
