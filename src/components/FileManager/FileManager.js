import React, { useContext, useEffect } from 'react';
import { Fab } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import axios from 'axios';
import { PhotoViewerContext } from '../../context/PhotoViewer/photoViewerContext';

function getModalStyle() {
    return {
        top: '50%',
        left: '50%',
        marginLeft: '-200px',
        marginTop: '-100px',
    };
}

const useStyles = makeStyles(theme => ({
    paper: {
        position: 'absolute',
        width: 400,
        height: 200,
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },
}));

/**
 * Компонент загрузки файлов на сервер.
 */
export const FileManager = options => {
    const classes = useStyles();
    const [modalStyle] = React.useState(getModalStyle);
    const [open, setOpen] = React.useState(false);
    const { uploadPhotos } = useContext(PhotoViewerContext);

    /**
     * Открытие модального окна с ошибкой.
     */
    const handleOpen = () => {
        setOpen(true);
    };

    /**
     * Закрытие модального окна с ошибкой.
     */
    const handleClose = () => {
        setOpen(false);
    };

    // Подключение переменных для работы с electron.
    const electron = window.require('electron');
    const ipcRenderer = electron.ipcRenderer;

    useEffect(() => {
        // Обработчик выбора файлов через проводник electron.
        ipcRenderer.on('chooseFiles', (event, arg) => {
            const formData = new FormData();
            arg.map(file => {
                formData.append('files', file);
            }, []);

            // Загрузка файлов на сервер.
            axios
                .post('/loadPhotos', formData)
                .then(res => {
                    uploadPhotos(res.data);
                })
                .catch(err => {
                    handleOpen();
                });
        });
    }, []);

    /**
     * Обработчик клика на кнопку выбора файла.
     * @param {Event} e
     */
    const uploadFile = e => {
        // Отправка события electron для отображения окна выбора файла.
        ipcRenderer.send('chooseFiles');
    };

    // Тело ошибки модального окна.
    const body = (
        <div style={modalStyle} className={classes.paper}>
            <h2 id="simple-modal-title">Что то пошло не так!</h2>
            <p id="simple-modal-description">
                Попробуйте загрузить изображение еще раз или обратитесь в тех.поддержку по адресу danythere@yandex.ru
            </p>
        </div>
    );

    return (
        <div className={options.className}>
            <label htmlFor="upload-photo">
                <Fab
                    onClick={uploadFile}
                    color="primary"
                    size="small"
                    component="span"
                    aria-label="add"
                    variant="extended">
                    <AddIcon /> Upload photo
                </Fab>
            </label>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description">
                {body}
            </Modal>
        </div>
    );
};
