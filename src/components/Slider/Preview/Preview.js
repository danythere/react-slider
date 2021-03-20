import { Tooltip } from '@material-ui/core';
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import classes from './Preview.module.scss';

const HtmlTooltip = withStyles(theme => ({
    tooltip: {
        backgroundColor: '#f5f5f9',
        color: 'rgba(0, 0, 0, 0.87)',
        maxWidth: 220,
        fontSize: theme.typography.pxToRem(12),
        border: '1px solid #dadde9',
    },
}))(Tooltip);

/**
 * Компонент предпросмотра всех изображений из папки.
 * @param {*} props
 */
export const Preview = props => {
    return (
        <div className={props.allPhotos.length > 6 ? classes.PreviewGrid : classes.PreviewRow}>
            {props.allPhotos.map(photo => {
                return props.currentPhoto.id !== photo.id ? (
                    <HtmlTooltip
                        key={photo.id}
                        title={
                            photo.metadata ? (
                                <React.Fragment>
                                    <ul>
                                        <li> channels: {photo.metadata.channels || 'Неизвестно'} </li>
                                        <li>chromaSubsampling: {photo.metadata.chromaSubsampling || 'Неизвестно'}</li>
                                        <li> density: {photo.metadata.density || 'Неизвестно'} </li>
                                        <li> depth: {photo.metadata.depth || 'Неизвестно'} </li>
                                        <li> format: {photo.metadata.format || 'Неизвестно'} </li>
                                        <li> hasAlpha: {photo.metadata.hasAlpha || 'Неизвестно'} </li>
                                        <li> hasProfile: {photo.metadata.hasProfile || 'Неизвестно'} </li>
                                        <li> height: {photo.metadata.height || 'Неизвестно'} </li>
                                        <li> space: {photo.metadata.space || 'Неизвестно'} </li>
                                        <li> width: {photo.metadata.width || 'Неизвестно'} </li>
                                    </ul>
                                </React.Fragment>
                            ) : null
                        }
                        placement="top">
                        <div
                            className={classes.Photo}
                            key={photo.id}
                            onClick={() => {
                                props.setPhoto(photo);
                            }}>
                            <img src={photo.link} alt="preview" width="50" height="30" />
                        </div>
                    </HtmlTooltip>
                ) : null;
            })}
        </div>
    );
};
