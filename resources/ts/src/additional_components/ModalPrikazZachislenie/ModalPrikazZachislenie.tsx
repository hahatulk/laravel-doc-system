import React, {useCallback, useEffect, useState} from 'react'
import {connect} from "react-redux"
import {withRouter} from "react-router"
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField} from "@material-ui/core";
import {useDropzone} from "react-dropzone";
import './ModalPrikazZachislenie.scss'
import {SnackBarUtils} from "../SnackBarUtils/SnackBarUtils";
import axios from "axios";
import {Loading} from "../Loading/Loading";
import {DatePicker} from "@material-ui/pickers";
import {downloadImportStudentsTemplate} from "../../redux/actions/actionsAdmin";
import {REACT_APP_ADMIN_PRIKAZ_ZACHISLENIE} from "../Routes/Routes";

function ModalPrikazZachislenie(props: any) {
    const [open, setOpen] = useState(false);

    const [prikazNumber, setPrikazNumber] = useState<number | string>('');
    const [group] = useState<number>(props.groupId)
    const [file, setFile] = useState<any>();
    const [prikazDate, setPrikazDate] = useState<string | Date>(new Date());

    const [loading, setLoading] = useState<boolean>(false);

    const onDrop = useCallback(acceptedFiles => {
        // Do something with the files
        if (acceptedFiles?.length) {
            SnackBarUtils.info('Файл выбран')
            setFileName(acceptedFiles[0].name)
            setFile(acceptedFiles[0])
        } else {
            SnackBarUtils.warning('Вы должны выбрать только 1 файл!')
        }
    }, [])
    const {getRootProps, getInputProps, isDragActive} = useDropzone({
        onDrop,
        accept: '.xls,.xlsx',
        maxFiles: 1,
    })
    const [fileName, setFileName] = useState<string>('');

    useEffect(() => {
        setPrikazNumber('')
        setFile(undefined)
        setPrikazDate(new Date())
        setFileName('')
    }, [open])

    function openDialog() {
        setOpen(true)
    }

    function closeDialog() {
        setOpen(false)
    }

    function handleSubmit() {
        if (group !== undefined && prikazNumber && file !== undefined) {
            setLoading(true)
            const formData = new FormData();

            formData.append('excelFile', file);
            formData.append('group', group.toString());
            formData.append('prikazNumber', prikazNumber.toString());
            formData.append('prikazDate', prikazDate.toString());

            axios.post(REACT_APP_ADMIN_PRIKAZ_ZACHISLENIE + ``,
                formData,
            )
                .then((res) => {
                    setLoading(false)
                    props.updateList()
                    setOpen(false)
                    SnackBarUtils.success('Приказ создан!')

                })
                .catch(e => {
                    const res = e.response
                    //check if tokens expired already
                    SnackBarUtils.error('Ошибка создания приказа. Проверьте соответствия документа шаблону.')
                    setLoading(false)
                    setOpen(false)
                })
        } else {
            SnackBarUtils.warning('Заполните все поля')
        }
    }

    return (
        <>
            <Button color={'primary'}
                    variant={'contained'}
                    style={{marginRight: '25px'}}
                    onClick={() => {
                        openDialog()
                    }}
            >
                Зачислить
            </Button>
            <Dialog
                open={open}
                maxWidth={'md'}
                fullWidth={true}
                onClose={closeDialog}
                aria-labelledby="form-dialog-title"
            >
                <DialogTitle id="form-dialog-title">Зачисление студентов (создание приказа о зачислении и добавление студентов)</DialogTitle>
                <Button color={'primary'}
                        variant={'contained'}
                        style={{marginRight: '25px'}}
                        onClick={() => {
                            props.downloadImportStudentsTemplate()
                        }}
                >
                    Шаблон для зачисления
                </Button>
                <DialogContent>
                    <Grid container spacing={2}>

                        <Grid item xs={12} md={6}>
                            <TextField
                                margin="normal"
                                name="prikazNumber"
                                label="Номер приказа"
                                type={'number'}
                                value={prikazNumber}
                                style={{width: '100%'}}
                                onChange={(e: any) => {
                                    const value = e.target.value
                                    if (!isNaN(parseInt(value)) || value === '') {
                                        setPrikazNumber(value)
                                    } else {
                                        e.preventDefault()
                                    }
                                }}
                            />

                            <DatePicker
                                margin={'normal'}
                                label="Дата приказа"
                                format="yyyy-MM-dd"
                                value={prikazDate || new Date()}
                                cancelLabel={'отмена'}
                                style={{width: '100%'}}
                                onChange={(e: any) => {
                                    setPrikazDate(e)
                                }}
                            />


                        </Grid>

                        <Grid item xs={12} md={6}>
                            <TextField
                                margin="normal"
                                name="fileName"
                                label="Выбранный файл"
                                value={fileName}
                                disabled={true}
                                style={{width: '100%'}}
                            />
                        </Grid>

                        <Grid item xs={12} md={12}>
                            <div {...getRootProps()} className={'students-import-zone'}>
                                <input {...getInputProps()} />
                                {
                                    isDragActive ?
                                        <p>Перетащите сюда файл...</p> :
                                        <p>Выберите или перетащите сюда Excel документ со студентами</p>
                                }
                            </div>
                        </Grid>

                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeDialog} color="primary">
                        Отмена
                    </Button>
                    <Button onClick={() => {
                        handleSubmit()
                    }} color="primary">
                        Зачислить
                    </Button>
                </DialogActions>
                {loading && <Loading/>}
            </Dialog>
        </>
    )
}

const mapStateToProps = (state: any) => {
    return {}
}
const mapDispatchToProps = (dispatch: any) => {
    return {
        downloadImportStudentsTemplate: () => {
            dispatch(downloadImportStudentsTemplate())
        },
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ModalPrikazZachislenie))
