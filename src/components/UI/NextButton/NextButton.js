import React from 'react';
import classes from './NextButton.module.scss';
import btnLogo from './../../../images/btnLogo.svg';
import classNames from 'classnames';

/**
 * Компонент стрелок вправо, влево.
 * @param {*} props 
 */
export const NextButton = props => (
    <div className={classes.NextButton} onClick={props.onClick}>
        <img src={btnLogo} alt='Next' className={props.left ? classNames(classes.Left, classes.BtnLogo) : classes.BtnLogo}></img>{' '}
    </div>
);
