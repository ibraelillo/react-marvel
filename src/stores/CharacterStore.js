/**
 * Created by ibra on 26/01/2016.
 */

import config from '../config';
import superagent from 'superagent';
import crypto from 'crypto';
import Dispatcher from '../core/Dispatcher';
import ActionTypes from '../constants/ActionTypes';


class CharacterStore {

    isLoaded = false;
    results = {};
    page = 1;
    count = 20;
    offset = 0;
    limit = 20;
    total = 0;
    totalPages = 0;
    agent = null;

    construct() {
        this.isLoaded = false;
    };
    doLimit = function(limit){
        if(limit)
            this.limit = parseInt(limit);

        return this;
    };

    gotoPage = function(page, lazy){

        if(page){

            this.page = page;

            if(!lazy)
                this.fetch();

        }

        return this;
    };

    fetch= function()    {

        this.offset = this.page * this.limit - this.limit;
        this.results = {};

        console.log( 'Fetching from ' + this.offset + ' to ' + (this.offset + this.limit));

        var ts = (new Date()).getTime();
        var hash = crypto.createHash('md5', config.API_PUBLIC).update(ts + config.API_PRIVATE + config.API_PUBLIC)
            .digest('hex');

        superagent
            .get(config.API_URL + '/v1/public/characters')
            .accept('application/json')
            .query({ ts: ts })
            .query({ apikey: config.API_PUBLIC})
            .query({ hash: hash })
            .query({ limit : this.limit })
            .query({ offset: this.offset })
            .end(function(err, res){

                if(res.statusCode == 200){
                    this.isLoaded = true;
                    this.total = res.body.data.total;
                    this.offset = res.body.data.offset;
                    console.log(this.total);
                    this.totalPages = Math.ceil(this.total / this.limit);

                    res.body.data.results.forEach(function(item){
                        this.results[item.id] = item;
                    }.bind(this))

                    Dispatcher.dispatch({
                        eventName: ActionTypes.FETCHED
                    })
               }

            }.bind(this))

        return this;
    };

    fetchOne = function(id){

        var ts = (new Date()).getTime();
        var hash = crypto.createHash('md5', config.API_PUBLIC).update(ts + config.API_PRIVATE + config.API_PUBLIC)
            .digest('hex');

        return superagent
            .get(config.API_URL + '/v1/public/characters/' + id)
            .accept('application/json')
            .query({ ts: ts })
            .query({ apikey: config.API_PUBLIC})
            .query({ hash: hash })
            .end(function(err, res){

                console.log(err, res);

                if(res.statusCode == 200){
                    this.results[id] = res.body.data.results[0];
                }

                Dispatcher.dispatch({
                    eventName: ActionTypes.FETCHED_ONE,
                    id: id
                });

            }.bind(this))
    };

    getAll = function(){
        return this.results;
    };

    get(id){
        return this.results[id];
    }

    /**
     *
     * @returns {Number}
     */
    count(){
        return Object.keys(this.results).length;
    }

    next = function(){

        this.page ++;

        return this.fetch();
    }

    prev = function(){
        this.page--;

        return this.fetch();
    }

    hasMore = function(){
        return this.offset < this.total;
    }
}

const store = new CharacterStore();


Dispatcher.register(function(payload){

    switch(payload.eventName){
        case ActionTypes.FETCH_ALL:
            store
                .doLimit(payload.limit)
                .fetch()
            ;
            break;

        case ActionTypes.FETCH_NEXT:
            store.next().fetch();
            break;

        case ActionTypes.FETCH_PREV:
            store.prev().fetch();
            break;

        case ActionTypes.FETCH_ONE:
            console.log(payload);
            store.fetchOne(payload.id)
            break;

        default:
    }
});

export  default store;