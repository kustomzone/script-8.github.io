import _ from 'lodash'
import { handleActions } from 'redux-actions'
import actionTypes from '../actions/actionTypes.js'
import initialState from '../store/initialState.js'

const extractGistRooms = data =>
  JSON.parse(
    _.get(
      data,
      'files["rooms.json"].content',
      JSON.stringify(initialState.rooms, null, 2)
    )
  )

const rooms = handleActions(
  {
    [actionTypes.NEW_GAME]: () => initialState.rooms,
    [actionTypes.FETCH_GIST_SUCCESS]: (state, action) =>
      extractGistRooms(action.payload),
    [actionTypes.UPDATE_ROOM]: (state, action) => action.payload
  },
  initialState.rooms
)

export default rooms

export { extractGistRooms }