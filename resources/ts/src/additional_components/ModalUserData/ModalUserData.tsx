import React, {useEffect, useState} from 'react'
import {connect} from "react-redux"
import {withRouter} from "react-router"
import {Loading} from '../Loading/Loading';
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, FormGroup, Grid, IconButton, InputAdornment, TextField} from "@material-ui/core";
import axios, {AxiosResponse} from "axios";
import {SnackBarUtils} from "../SnackBarUtils/SnackBarUtils";
import {getLocalPlainDateTime} from "../Dates";
import {Visibility, VisibilityOff} from '@material-ui/icons';
import {REACT_APP_ADMIN_STUDENT_CREDENTIALS, REACT_APP_ADMIN_STUDENT_EDIT_CREDENTIALS} from "../Routes/Routes";

function ModalUserData(props: any) {
    const [open, setOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [originalUsername, setOriginalUsername] = useState('');
    const [username, setUsername] = useState('Загрузка...');
    const [password, setPassword] = useState('Загрузка...');
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [lastLogin, setLastLogin] = useState('Загрузка...');
    const [status, setStatus] = useState(-1);
    const [loading, setLoading] = useState(true);

    function openDialog() {
        setOpen(true)
    }

    function closeDialog() {
        if (!isSubmitting) {
            setOpen(false)
        }
    }

    function handleSubmit(username: any, password: any, status: any) {
        setLoading(true)
        axios.post(REACT_APP_ADMIN_STUDENT_EDIT_CREDENTIALS + ``,
            {
                original_username: originalUsername,
                username: username,
                password: password,
                status: status,
            })
            .then((res: AxiosResponse) => {
                SnackBarUtils.success('Данные обновлены')

                setLoading(false)
                setOpen(false)
            })
            .catch(() => {
                SnackBarUtils.error('Ошибка обновления данных студента')
                setOpen(false)
            })
    }

    useEffect(() => {
        if (open) {
            setLoading(true)

            axios.get(REACT_APP_ADMIN_STUDENT_CREDENTIALS + `?userId=${props.userId}`)
                .then((res: AxiosResponse) => {
                    const _username: string = res.data.data.username
                    const _password: string = res.data.data.password
                    const _status: string = res.data.data.status
                    const _lastLogin: string = res.data.data.lastLogin

                    setUsername(_username)
                    setOriginalUsername(_username)
                    setPassword(_password)
                    setStatus(parseInt(_status))
                    setLastLogin(_lastLogin)

                    setLoading(false)
                })
                .catch(() => {
                    SnackBarUtils.error('Ошибка загрузки данных студента')
                    setOpen(false)
                })
        }
    }, [open])

    return (
        <>
            <Button color={'primary'}
                    variant={'contained'}
                    onClick={() => {
                        openDialog()
                    }}
            >
                Показать
            </Button>
            <Dialog
                open={open}
                maxWidth={'sm'}
                fullWidth={true}
                onClose={closeDialog}
                aria-labelledby="form-dialog-title"
            >
                <form onSubmit={(e: any) => {
                    e.preventDefault()
                    handleSubmit(
                        username,
                        password,
                        status
                    )
                }}>
                    <DialogTitle id="form-dialog-title">Данные входа</DialogTitle>
                    <DialogContent>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                                <FormGroup>
                                    <TextField
                                        margin="normal"
                                        name="username"
                                        label="Логин"
                                        value={username}
                                        onChange={(e) => {
                                            setUsername(e.target.value)
                                        }}
                                    />

                                    {/*<FormControl margin={'normal'}>*/}
                                    {/*    <InputLabel>Статус</InputLabel>*/}
                                    {/*    <Select*/}
                                    {/*        native*/}
                                    {/*        name={'status'}*/}
                                    {/*        value={status}*/}
                                    {/*        onChange={(e: any) => {*/}
                                    {/*            setStatus(parseInt(e.target.value))*/}
                                    {/*        }}*/}
                                    {/*    >*/}
                                    {/*        <option value={0}>Активен</option>*/}
                                    {/*        <option value={1}>Заблокирован</option>*/}
                                    {/*        <option value={2}>Приостановлен</option>*/}
                                    {/*    </Select>*/}
                                    {/*</FormControl>*/}
                                </FormGroup>
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <FormGroup>

                                    <TextField
                                        margin="normal"
                                        label="Пароль"
                                        name="password"
                                        type={passwordVisible ? 'text' : 'password'}
                                        value={password}
                                        onChange={(e) => {
                                            setPassword(e.target.value)
                                        }}
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        aria-label="toggle password visibility"
                                                        onClick={() => {
                                                            setPasswordVisible(!passwordVisible)
                                                        }}
                                                    >
                                                        {passwordVisible ? <Visibility/> : <VisibilityOff/>}
                                                    </IconButton>
                                                </InputAdornment>
                                            )
                                        }}
                                    />

                                    <TextField
                                        margin="normal"
                                        name="lastLogin"
                                        label="Последний вход"
                                        value={lastLogin && lastLogin !== 'Загрузка...' ? getLocalPlainDateTime(lastLogin) : '-'}
                                    />
                                </FormGroup>
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={closeDialog} color="primary">
                            Отмена
                        </Button>
                        <Button type={'submit'} color="primary">
                            Сохранить
                        </Button>
                    </DialogActions>
                </form>
                {loading && <Loading/>}
            </Dialog>
        </>
    )
}

const mapStateToProps = (state: any) => {
    return {
        Auth: state.Auth,
        Admin: state.Admin,
        User: state.User
    }
}
const mapDispatchToProps = (dispatch: any) => {
    return {}
}
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ModalUserData))
