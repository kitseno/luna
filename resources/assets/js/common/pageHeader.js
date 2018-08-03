import React from 'react'
import PropTypes from 'prop-types'
import {
    Header,
    Grid,
    Segment
} from 'semantic-ui-react'

class PageHeader extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Segment className="page-header" textAlign="center" vertical>
                <h3 className="bp3-heading">{this.props.heading}</h3>
            </Segment>
        );
    }
}

PageHeader.propTypes = {
    heading : PropTypes.string.isRequired
};
export default PageHeader;
