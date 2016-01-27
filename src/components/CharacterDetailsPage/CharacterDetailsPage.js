/**
 * Created by ibra on 27/01/2016.
 */

import React, { PropTypes, Component } from 'react';
import CharacterStore from '../../stores/CharacterStore';

import styles from './CharacterDetailsPage.css';

import withContext from '../../decorators/withContext';
import withStyles  from '../../decorators/withStyles';


import ActionTypes from '../../constants/ActionTypes';
import MarvelActions from '../../actions/MarvelActions';
import Dispatcher from '../../core/Dispatcher';


//@withContext
@withStyles(styles)
class CharacterDetailsPage extends Component{

    state = {
        character : null
    }


    componentWillMount(){
        this.token  = Dispatcher.register(function(payload){
            if(payload.eventName == ActionTypes.FETCHED_ONE)
                this.setState({
                    character: CharacterStore.get(this.props.id)
                });
        }.bind(this))
    }

    componentWillUnmount(){
        Dispatcher.unregister(this.token);
    }

    componentDidMount(){
        console.log(this.props);
        MarvelActions.fetchOne(this.props.id);
    }

    render(){

        var character = this.state.character;
        var series = [];
        var comics = [];

        if(character){
            character.comics.items.map(function(comic){
                comics.push(
                    <li>
                        <a href={comic.resourceURI}>{comic.name}</a>
                    </li>
                )
            });

            character.series.items.map(function(serie){
                series.push(
                    <li>
                        <a href={serie.resourceURI}>{serie.name}</a>
                    </li>
                )
            });
        }

        return <div className="CharacterDetailsPage-container">
            <div className="container-fluid" id="main">
                <div className="col-lg-4">
                    <div className="thumbnail">
                        <img src={character ? character.thumbnail.path + '.' +character.thumbnail.extension : null }/>
                    </div>
                </div>
                <div className="col-lg-8">
                    <div className="page-header">
                        <h2>{character ? character.name : null}</h2>
                        <p>{character ? character.description : null}</p>
                    </div>
                    <div className="row-fluid">
                        <h4>Comics</h4>
                        <ul className="list-unstyled" id="comics">{comics}</ul>
                    </div>
                    <div className="row-fluid">
                        <h4>Series</h4>
                        <ul className="list-unstyled" id="series">{series}</ul>
                    </div>
                </div>
            </div>
        </div>
    }
}

export default CharacterDetailsPage;