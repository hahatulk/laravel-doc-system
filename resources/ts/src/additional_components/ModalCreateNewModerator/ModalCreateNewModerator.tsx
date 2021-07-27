import React, {useEffect, useState} from 'react'
import {connect} from "react-redux"
import {withRouter} from "react-router"
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField} from "@material-ui/core";
import './ModalCreateNewModerator.scss'
import {Loading} from "../Loading/Loading";
import {downloadImportStudentsTemplate} from "../../redux/actions/actionsAdmin";
import axios, {AxiosResponse} from "axios";
import {SnackBarUtils} from "../SnackBarUtils/SnackBarUtils";
import {REACT_APP_ADMIN_MODERATORS_CREATE} from "../Routes/Routes";

function ModalCreateNewModerator(props: any) {
    const [open, setOpen] = useState(false);

    const [fio, setFio] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const [loading, setLoading] = useState<boolean>(false);

    //получить список приказов
    useEffect(() => {
        if (open) {

        } else {

        }
    }, [open])

    useEffect(() => {
        if (open) {

        } else {

        }
    }, [])

    function openDialog(): void {
        setOpen(true)
    }

    function closeDialog(): void {
        setOpen(false)
    }

    function handleSubmit(): void {
        setLoading(true)
        axios.post(REACT_APP_ADMIN_MODERATORS_CREATE + ``,
            {
                fio: fio,
                password: password,
            })
            .then((r: AxiosResponse) => {
                SnackBarUtils.success('Администратор создан')
                props.updateList()
                setOpen(false)
            })
            .catch((e) => {
                SnackBarUtils.error('Ошибка создания администратора')
            })
            .finally(() => {
                setLoading(false)
            })
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
                Создать
            </Button>
            <Dialog
                open={open}
                maxWidth={'md'}
                fullWidth={true}
                onClose={closeDialog}
                aria-labelledby="form-dialog-title"
            >
                <DialogTitle id="form-dialog-title">Добавление администратора</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={12}>
                            <TextField
                                margin="normal"
                                label="ФИО"
                                value={fio}
                                style={{width: '100%'}}
                                onChange={(e) => {
                                    setFio(e.target.value)
                                }}
                            />

                            <TextField
                                margin="normal"
                                label="Пароль"
                                value={password}
                                style={{width: '100%'}}
                                onChange={(e) => {
                                    setPassword(e.target.value)
                                }}/>
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
                        Создать
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
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ModalCreateNewModerator))
