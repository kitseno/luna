import React from 'react'
import PropTypes from 'prop-types'

class PageHeader extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <h3 className="bp3-heading">{this.props.heading}</h3>
            </div>
        );
    }
}

PageHeader.propTypes = {
    heading : PropTypes.string.isRequired
};
export default PageHeader;
