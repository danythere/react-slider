import { CHANGE_CURRENT_PHOTO, SET_CURRENT_PHOTO } from '../types';
/**
 * Редьюсеры.
 */
const handlers = {
    [CHANGE_CURRENT_PHOTO]: (state, action) => ({
        ...state,
        currentPhoto: action.payload.currentPhoto,
        allPhotos: action.payload.allPhotos,
    }),
    [SET_CURRENT_PHOTO]: (state, action) => ({
        ...state,
        currentPhoto: action.payload,
    }),
    DEFAULT: state => state,
};
export const photoViewerReducer = (state, action) => {
    const handler = handlers[action.type] || handlers.DEFAULT;
    return handler(state, action);
};
