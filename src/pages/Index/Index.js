import React from 'react';
import classes from './Index.module.scss';
import { Slider } from '../../components/Slider/Slider';
import { PhotoViewerState } from '../../context/PhotoViewer/PhotoViewerState';
import { FileManager } from '../../components/FileManager/FileManager';
/**
 * Главная страница.
 */

export const Index = () => {
    return (
        <PhotoViewerState>
            <div className={classes.Index}>
                <Slider />
                <FileManager className={classes.FileManager} />
            </div>
        </PhotoViewerState>
    );
};
