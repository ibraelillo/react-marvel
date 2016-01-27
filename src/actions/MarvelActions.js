/**
 * Created by ibra on 26/01/2016.
 */

import ActionTypes from '../constants/ActionTypes';
import Dispatcher  from '../core/Dispatcher';

/**
 *
 */
class MarvelActions {


    /**
     * Fetch a page
     *
     * @param page
     * @param limit
     */
    fetch (page, limit) {

        var token = this.dispatch(
            {
                eventName: ActionTypes.FETCH_ALL,
                page: page,
                limit: limit
            }
        )
    }

    prevPage(){
        return this.dispatch({ eventName: ActionTypes.FETCH_PREV });
    };

    nextPage(){
        this.dispatch(
            {
                eventName: ActionTypes.FETCH_NEXT
            }
        )
    }

    /**
     *  dispatch event to store to fetch one by id
     *
     * @param id
     */
    fetchOne (id){
        var token = this.dispatch(
            {
                eventName: ActionTypes.FETCH_ONE,
                id: id
            }
        )
    }

    /**
     * Dispatch the event
     * @param eventName
     * @param payload
     */
    dispatch (payload){
        return Dispatcher.dispatch(payload);
    }
}
const marvel = new MarvelActions();

export default marvel;