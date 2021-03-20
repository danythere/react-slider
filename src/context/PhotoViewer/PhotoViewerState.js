import React, { useReducer } from 'react';
import { CHANGE_CURRENT_PHOTO, SET_CURRENT_PHOTO } from '../types';
import { PhotoViewerContext } from './photoViewerContext';
import { photoViewerReducer } from './photoViewerReducer';
import firstInitSlide from './../../images/initSlide0.png';
import secondInitSlide from './../../images/initSlide1.png';
import thirdInitSlide from './../../images/initSlide2.png';

export const PhotoViewerState = ({ children }) => {
    const initialState = {
        currentPhoto: {
            id: 0,
            link: firstInitSlide,
        },
        allPhotos: [
            {
                id: 0,
                link: firstInitSlide,
            },
            {
                id: 1,
                link: secondInitSlide,
            },
            {
                id: 2,
                link: thirdInitSlide,
            },
        ],
    };
    const [state, dispatch] = useReducer(photoViewerReducer, initialState);
    const { currentPhoto, allPhotos } = state;
    /**
     * Функция изменения текущей картинки.
     * @param {Boolean} isNext - true-вперед, false-назад.
     */
    const changePhoto = async isNext => {
        if (isNext) {
            const newPhotos = shiftLeft(allPhotos);
            dispatch({
                type: CHANGE_CURRENT_PHOTO,
                payload: {
                    currentPhoto: newPhotos[0],
                    allPhotos: newPhotos,
                },
            });
        } else {
            const newPhotos = shiftRight(allPhotos);
            dispatch({
                type: CHANGE_CURRENT_PHOTO,
                payload: {
                    currentPhoto: newPhotos[0],
                    allPhotos: newPhotos,
                },
            });
        }
    };

    /**
     * Установить текущее фото.
     * @param {*} photo
     */
    const setPhoto = photo => {
        dispatch({
            type: SET_CURRENT_PHOTO,
            payload: photo,
        });
    };

    /**
     * Отобразить текущие фото.
     * @param {*} photos
     */
    const uploadPhotos = photos => {
        const newPhotos = [...photos];
        debugger;
        for (let i = 0; i < photos.length; i++) {
            newPhotos[i] = {
                ...photos[i],
                link: photos[i].path,
                id: i,
            };
        }
        dispatch({
            type: CHANGE_CURRENT_PHOTO,
            payload: {
                currentPhoto: newPhotos[0],
                allPhotos: newPhotos,
            },
        });
    };
    return (
        <PhotoViewerContext.Provider
            value={{
                currentPhoto,
                allPhotos,
                changePhoto,
                setPhoto,
                uploadPhotos,
            }}>
            {children}
        </PhotoViewerContext.Provider>
    );
};

/**
 * Цикл. сдвиг вправо.
 * @param {} oldArr 
 */
function shiftRight(oldArr) {
    const arr = [...oldArr];
    const tmp = arr[arr.length - 1];
    for (let i = arr.length - 1; i > 0; i--) {
        arr[i] = arr[i - 1];
    }
    arr[0] = tmp;
    return arr;
}

/**
 * Цикл. сдвиг влево.
 * @param {*} oldArr 
 */
function shiftLeft(oldArr) {
    const arr = [...oldArr];
    const tmp = arr[0];
    for (let i = 0; i < arr.length - 1; i++) {
        arr[i] = arr[i + 1];
    }
    arr[arr.length - 1] = tmp;
    return arr;
}
