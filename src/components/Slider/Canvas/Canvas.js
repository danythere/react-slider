import React, { useEffect, useRef } from 'react';
import ClearIcon from '@material-ui/icons/Clear';
import classes from './Canvas.module.scss';
import { Fab } from '@material-ui/core';
import * as d3 from 'd3';

/**
 * Компонент холста для отображения изображений.
 * @param {*} props
 */
export const Canvas = props => {
    const svg = useRef(null);
    const g = useRef(null);
    const currentTransform = useRef(d3.zoomTransform(1, 0, 0));

    // Обработчик на нажатие клавиш вниз, влево, вправо, вверх.
    const transformPhoto = e => {
        switch (e.code) {
            case 'ArrowLeft':
                currentTransform.current.x -= 10;
                break;
            case 'ArrowUp':
                currentTransform.current.y -= 10;
                break;
            case 'ArrowRight':
                currentTransform.current.x += 10;
                break;
            case 'ArrowDown':
                currentTransform.current.y += 10;
                break;
            default:
                break;
        }
        g.current.attr('transform', currentTransform.current);
    };
    useEffect(() => {
        document.addEventListener('keydown', transformPhoto);
        svg.current = d3
            .select('svg')
            .attr('width', '100%')
            .attr('height', '100%')
            .attr('id', 'canvas')
            .attr('preserveAspectRatio', 'xMidYMid meet');
        g.current = svg.current.select('g').attr('id', 'g-path');
        g.current.append('svg:image')
            .attr('x', 0)
            .attr('y', 0)
            .attr('xlink:href', props.currentPhoto.link)
            .attr('id', 'canvas-image');

        const pic = new Image(); // Создаём изображение.
        pic.src = props.currentPhoto.link; // Источник изображения.
        pic.onload = () => {
            // Картинка во весь холст.
            svg.current.attr('viewBox', '0 0 ' + pic.width + ' ' + pic.height);
        };
        svg.current.call(
            d3.zoom().on('zoom', event => {
                // Устанавливаем максимальный и минимальный масштаб.
                const t = event.transform;
                if (t.k < 0.5) {
                    t.k = 0.5;
                    t.x = currentTransform.current.x;
                    t.y = currentTransform.current.y;
                    g.current.attr('transform', t);
                } else if (t.k >= 10) {
                    t.k = currentTransform.current.k;
                    t.x = currentTransform.current.x;
                    t.y = currentTransform.current.y;
                    g.current.attr('transform', t);
                } else {
                    g.current.attr('transform', t);
                }
                currentTransform.current=t;
            })
        );
        return () => {
            document.removeEventListener('keydown', transformPhoto);
        };
    }, []);

    useEffect(() => {
        document
            .querySelector('svg image')
            .setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', props.currentPhoto.link);
        g.current.attr('transform', 'translate(0, 0)scale(1)');
        d3.zoom().transform(svg.current, d3.zoomIdentity.translate(0, 0).scale(1));
        const pic = new Image();
        pic.src = props.currentPhoto.link;
        pic.onload = function() {
            svg.current.attr('viewBox', '0 0 ' + pic.width + ' ' + pic.height);
        };
    }, [props.currentPhoto]);

    /**
     * Обработка нажатия на кнопку очищенения масштабирования и трансформирования.
     */
    const clearMoving = () => {
        if (currentTransform.current) {
            currentTransform.current.x = 0;
            currentTransform.current.y = 0;
            currentTransform.current.k = 1;
            g.current.attr('transform', currentTransform.current);
        }
    };
    return (
        <div className={classes.Canvas} id="canvas">
            <svg>
                <g className={classes.GElem}> </g>
            </svg>
            <Fab
                className={classes.ClearMoving}
                onClick={clearMoving}
                color="secondary"
                size="small"
                component="span"
                aria-label="add"
                variant="extended">
                <ClearIcon />
                Clear changes
            </Fab>
        </div>
    );
};
