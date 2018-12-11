import React from 'react'

class NumberFormat extends React.Component {

    constructor(props) {
        super(props);

        this.decimal = this.props.decimal ? this.props.decimal : 0;
    }

    render() {
        return (
            <span>
                {this.props.children.toLocaleString(navigator.language, { minimumFractionDigits: this.decimal })}
            </span>
        );
    }
}

export default NumberFormat;

//