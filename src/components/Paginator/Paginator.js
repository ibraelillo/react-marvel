/**
 * Created by ibra on 27/01/2016.
 */

import React, { PropTypes, Component } from 'react';

import ActionTypes from '../../constants/ActionTypes';
import MarvelActions from '../../actions/MarvelActions';


import CharacterStore from '../../stores/CharacterStore';

/**
 * pagination for lists
 */
class Paginator extends Component{

    next(){
        MarvelActions.nextPage();
    };

    prev(){
        MarvelActions.prevPage();
    }

    render(){
        return <div className="clearfix">
            <a className="btn btn-primary pull-left" onClick={this.prev}>Avant</a>
            <a className="btn btn-primary pull-right" onClick={this.next}>Suivant</a>
            <div className="text-center">Page {CharacterStore.page} de {CharacterStore.totalPages}</div>
        </div>
    }
}

export default Paginator;