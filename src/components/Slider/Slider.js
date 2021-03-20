import React, { useContext } from 'react';
import { PhotoViewerContext } from '../../context/PhotoViewer/photoViewerContext';
import { NextButton } from '../UI/NextButton/NextButton';
import { Canvas } from './Canvas/Canvas';
import { Preview } from './Preview/Preview';
import classes from './Slider.module.scss';

export const Slider = () => {
    const { currentPhoto, allPhotos, changePhoto, setPhoto } = useContext(PhotoViewerContext);
    return (
        <div className={classes.Slider}>
            <div className={classes.Slide}>
                <NextButton
                    className={classes.NextBtn}
                    left={true}
                    onClick={() => {
                        changePhoto();
                    }}
                />
                <Canvas currentPhoto={currentPhoto} />
                <NextButton
                    className={classes.NextBtn}
                    onClick={() => {
                        changePhoto(true);
                    }}
                />
            </div>
            <Preview setPhoto={setPhoto} allPhotos={allPhotos} currentPhoto={currentPhoto} />
        </div>
    );
};
