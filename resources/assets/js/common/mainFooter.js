import React from 'react'
import {
    Button,
    Container,
    Grid,
    Header,
    Icon,
    List,
    Responsive
} from 'semantic-ui-react'

import {Link} from 'react-router-dom'

class Footer extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="footer border-top pt-4">
                <Container>
                    <Grid columns="equal" verticalAlign="middle" className="foobar" stackable>
                        <Grid.Row>
                            <Grid.Column>
                                <Header as="h5">footer &copy; 2018</Header>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Container>
            </div>
        );
    }
}

export default Footer;
