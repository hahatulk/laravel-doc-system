import React, {useEffect, useState} from 'react'
import {connect} from "react-redux"
import {withRouter} from "react-router"
import {Loading} from '../../Loading/Loading';
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, FormGroup, Grid, TextField} from "@material-ui/core";
import {logout} from "../../../redux/actions/actionsAuth";
import axios, {AxiosResponse} from "axios";
import _ from "lodash";
import {SnackBarUtils} from "../../SnackBarUtils/SnackBarUtils";
import ModalPreviewDocument from "../ModalPreviewDocument/ModalPreviewDocument";
import {REACT_APP_ADMIN_DOWNLOAD_PREVIEW, REACT_APP_ADMIN_ORDER_FULLFILL_DOCUMENT, REACT_APP_ADMIN_ORDER_GENERATE_DOCUMENT} from "../../Routes";

function PrepareOrder(props: any) {
    const {row, updateList} = props

    const [open, setOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loading, setLoading] = useState(true);

    const [preparedData, setPreparedData] = useState<any>({
        docType: '',
        orderId: row.id,
        outputDocName: '',
        previewToken: '',
        vars: {
            "Фамилия": '',
            "Имя": '',
            "Отчество": '',
            "Курс": -1,
            "Группа": '',
            "ФормаОбучения": '',
            "БюджетПлат": '',
            "НачалоУчебы": '',
            "КонецУчебы": '',
        },
    })

    function openDialog() {
        setOpen(true)
    }

    function closeDialog() {
        if (!isSubmitting) {
            setOpen(false)
        }
    }

    function handleSubmit() {
        setLoading(true)

        axios.post(REACT_APP_ADMIN_ORDER_FULLFILL_DOCUMENT + ``,
            {
                ...preparedData,
                fullFilled: 1
            })
            .then((r: AxiosResponse) => {
                setLoading(false)
                updateList()
            })
            .catch(() => {
                SnackBarUtils.error('Ошибка создания документа')
                // setOpen(false)
            })
    }


    useEffect(() => {
        if (open) {
            setLoading(true)

            //получить данные для проверки
            axios.get(REACT_APP_ADMIN_ORDER_GENERATE_DOCUMENT +
                `?orderId=${row.id}&fullFilled=${row.fullFilled}`,
            )
                .then((r: AxiosResponse) => {
                    setPreparedData(r.data.data)
                    setLoading(false)
                })
                .catch(() => {
                    SnackBarUtils.error('Ошибка получения данных')
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
                Создать
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
                    handleSubmit()
                }}>
                    <DialogTitle id="form-dialog-title">Проверка данных</DialogTitle>
                    <DialogContent>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={12}>
                                {preparedData.previewToken?.length > 0
                                    ? <ModalPreviewDocument
                                        previewedURL={encodeURIComponent(REACT_APP_ADMIN_DOWNLOAD_PREVIEW +
                                            `?orderId=${(preparedData.orderId)}&AccessToken=${(preparedData.previewToken)}`)}
                                    />
                                    : 'Ожидание деталей...'}
                            </Grid>

                            <Grid item xs={12} md={4}>
                                <FormGroup>
                                    <TextField
                                        margin="normal"
                                        name="Фамилия"
                                        label="Фамилия"
                                        value={preparedData.vars["Фамилия"]}
                                        onChange={(e) => {
                                            if (e.target.value !== undefined) {
                                                let _preparedData = _.cloneDeep(preparedData)
                                                _preparedData.vars["Фамилия"] = e.target.value
                                                setPreparedData(_preparedData)
                                            }
                                        }}
                                    />

                                    <TextField
                                        margin="normal"
                                        name="Имя"
                                        label="Имя"
                                        value={preparedData.vars["Имя"]}
                                        onChange={(e) => {
                                            if (e.target.value !== undefined) {
                                                let _preparedData = _.cloneDeep(preparedData)
                                                _preparedData.vars["Имя"] = e.target.value
                                                setPreparedData(_preparedData)
                                            }
                                        }}
                                    />

                                    <TextField
                                        margin="normal"
                                        name="Отчество"
                                        label="Отчество"
                                        value={preparedData.vars["Отчество"]}
                                        onChange={(e) => {
                                            if (e.target.value !== undefined) {
                                                let _preparedData = _.cloneDeep(preparedData)
                                                _preparedData.vars["Отчество"] = e.target.value
                                                setPreparedData(_preparedData)
                                            }
                                        }}
                                    />

                                </FormGroup>
                            </Grid>

                            <Grid item xs={12} md={4}>
                                <FormGroup>
                                    <TextField
                                        margin="normal"
                                        name="Курс"
                                        label="Курс"
                                        type={'number'}
                                        inputProps={{min: 1, max: 4}}
                                        value={preparedData.vars["Курс"]}
                                        onChange={(e) => {
                                            if (e.target.value !== undefined) {
                                                if (parseInt(e.target.value) <= 4 && parseInt(e.target.value) >= 1) {
                                                    let _preparedData = _.cloneDeep(preparedData)
                                                    _preparedData.vars["Курс"] = e.target.value
                                                    setPreparedData(_preparedData)
                                                }
                                            }
                                        }}
                                    />

                                    <TextField
                                        margin="normal"
                                        name="Группа"
                                        label="Группа"
                                        value={preparedData.vars["Группа"]}
                                        onChange={(e) => {
                                            if (e.target.value !== undefined) {
                                                let _preparedData = _.cloneDeep(preparedData)
                                                _preparedData.vars["Группа"] = e.target.value
                                                setPreparedData(_preparedData)
                                            }
                                        }}
                                    />

                                    <TextField
                                        margin="normal"
                                        name="ФормаОбучения"
                                        label="Форма обучения"
                                        value={preparedData.vars["ФормаОбучения"]}
                                        onChange={(e) => {
                                            if (e.target.value !== undefined) {
                                                let _preparedData = _.cloneDeep(preparedData)
                                                _preparedData.vars["ФормаОбучения"] = e.target.value
                                                setPreparedData(_preparedData)
                                            }
                                        }}
                                    />

                                </FormGroup>
                            </Grid>

                            <Grid item xs={12} md={4}>
                                <FormGroup>
                                    <TextField
                                        margin="normal"
                                        name="БюджетПлат"
                                        label="Бюджетно / Платно"
                                        value={preparedData.vars["БюджетПлат"]}
                                        onChange={(e) => {
                                            if (e.target.value !== undefined) {
                                                let _preparedData = _.cloneDeep(preparedData)
                                                _preparedData.vars["БюджетПлат"] = e.target.value
                                                setPreparedData(_preparedData)
                                            }
                                        }}
                                    />

                                    <TextField
                                        margin="normal"
                                        name="НачалоУчебы"
                                        label="Начало учебы"
                                        value={preparedData.vars["НачалоУчебы"]}
                                        onChange={(e) => {
                                            if (e.target.value !== undefined) {
                                                let _preparedData = _.cloneDeep(preparedData)
                                                _preparedData.vars["НачалоУчебы"] = e.target.value
                                                setPreparedData(_preparedData)
                                            }
                                        }}
                                    />

                                    <TextField
                                        margin="normal"
                                        name="КонецУчебы"
                                        label="Конец учебы"
                                        value={preparedData.vars["КонецУчебы"]}
                                        onChange={(e) => {
                                            if (e.target.value !== undefined) {
                                                let _preparedData = _.cloneDeep(preparedData)
                                                _preparedData.vars["КонецУчебы"] = e.target.value
                                                setPreparedData(_preparedData)
                                            }
                                        }}
                                    />

                                </FormGroup>
                            </Grid>

                            {/*<Grid item xs={12} md={12}>*/}
                            {/*    <FormGroup>*/}
                            {/*        <TextField*/}
                            {/*            margin="normal"*/}
                            {/*            name="outputDocName"*/}
                            {/*            label="Название файла"*/}
                            {/*            value={preparedData["outputDocName"]}*/}
                            {/*            disabled={true}*/}
                            {/*            onChange={(e) => {*/}
                            {/*                if (e.target.value !== undefined) {*/}
                            {/*                    let _preparedData = _.cloneDeep(preparedData)*/}
                            {/*                    _preparedData["outputDocName"] = e.target.value*/}
                            {/*                    setPreparedData(_preparedData)*/}
                            {/*                }*/}
                            {/*            }}*/}
                            {/*        />*/}
                            {/*    </FormGroup>*/}
                            {/*</Grid>*/}

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
    return {
        logout: () => {
            dispatch(logout());
        },
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(PrepareOrder))
