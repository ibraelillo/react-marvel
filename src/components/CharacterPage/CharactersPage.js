/**
 * Created by ibra on 26/01/2016.
 */

import React, { PropTypes, Component } from 'react';
import CharacterStore from '../../stores/CharacterStore';

import styles from './CharactersPage.css';


import withStyles from '../../decorators/withStyles';

import Link from '../Link/Link';

import Paginator from '../Paginator/Paginator';
import AjaxIndicator from '../AjaxIndicator/AjaxIndicator'

import ActionTypes from '../../constants/ActionTypes';
import MarvelActions from '../../actions/MarvelActions';
import Dispatcher from '../../core/Dispatcher';


@withStyles(styles)
class CharactersPage extends Component {


    static propTypes = {
        //id: PropTypes.string.isRequired,
        title: PropTypes.string
    };

    static contextTypes = {
        onSetTitle: PropTypes.func.isRequired,
    };


    componentWillMount(){

        Dispatcher.register(function (payload) {
            console.log(payload);

            if (payload.eventName == ActionTypes.FETCHED)
                this.onChange();


            return payload;
        }.bind(this));
    }


    onChange (){
        this.forceUpdate();
    };

    componentDidMount() {
        MarvelActions.fetch();
    };

    render() {
        this.context.onSetTitle(this.props.title);
        var characters = CharacterStore.getAll();

        var ids = Object.keys(characters);
        var offset = 0;
        var rows = [];

        // rows of
        do {
            var rowIds = ids.slice(offset, offset + 3);

            var characterPanels = rowIds.map(function (id, index) {
                var ch = characters[id];
                var chUrl = '/' + id;

                var urls = ch.urls.map(function (resource, index) {
                    return <li key={index}>
                        <a href={resource.url}>
                            <i className="glyphicon glyphicon-book"></i>
                            {' ' + resource['type']}
                        </a>
                    </li>
                })

                return <div key={index} className="col-sm-12 col-md-4 col-lg-4">
                    <div className="panel panel-default">
                        <div className="panel-body item">
                            <div className="item-image">
                                <a href={chUrl} onClick={Link.handleClick}>
                                    <img className="img-responsive"
                                         src={ch.thumbnail.path + '.' +ch.thumbnail.extension}/>
                                </a>
                            </div>
                        </div>
                        <div className="panel-body">
                            <a href={chUrl} onClick={Link.handleClick}>
                                {ch.name}
                            </a>
                        </div>
                        <div className="panel-footer clearfix">
                            <ul className="list-inline">{urls}</ul>
                        </div>
                    </div>
                </div>
            });

            rows.push(
                <div className="row" key={offset / 3 }>{characterPanels}</div>
            );

            offset += 4;

        } while (offset <= ids.length);


        return (
            <div className="CharacterPage-container" id="main">
                <div className="page-header">
                    <h2 className="text-center">
                        Liste des super héros
                    </h2>
                    <Paginator />
                </div>

                <div className="clearfix">
                    {rows}
                    <hr/>
                    <Paginator/>
                </div>

            </div>
        );
    }

}

export default CharactersPage;