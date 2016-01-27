/**
 * Created by ibra on 27/01/2016.
 */

import React, { PropTypes, Component } from 'react';
import styles from './AjaxIndicator.css';
import withStyles from '../../decorators/withStyles';

@withStyles(styles)
class AjaxIndicator extends Component{

    static propTypes = {
        //id: PropTypes.string.isRequired,
        loading: PropTypes.boolean
    };

    defaultProps = {
        loading: false
    };

    render(){

        return this.props.loading  ? null : <div className="spinner">
            <div className="cube1"></div>
            <div className="cube2"></div>
        </div>
    }
}