import React, {useEffect, useState} from 'react'
import {connect} from "react-redux"
import {withRouter} from "react-router"
import {Loading} from '../Loading/Loading';
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormGroup, Grid, InputLabel, Select, TextField} from "@material-ui/core";
import axios, {AxiosResponse} from "axios";
import {SnackBarUtils} from "../SnackBarUtils/SnackBarUtils";
import {getLocalDate} from "../Dates";
import {REACT_APP_ADMIN_STUDENT_EDIT_GETALL_GROUPS, REACT_APP_ADMIN_STUDENT_GET} from "../Routes/Routes";

function StudentDataModal(props: any) {
    const [open, setOpen] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [student, setStudent] = useState<any>({})

    const [groups, setGroups] = useState<any>([])
    const [groupsLoading, setGroupsLoading] = useState<boolean>(true);

    const userId: number = props.userId

    function openDialog() {
        setOpen(true)
    }

    function closeDialog() {
        setOpen(false)
    }

    useEffect(() => {
        if (open) {
            setLoading(true)

            axios.get(REACT_APP_ADMIN_STUDENT_GET + `?userId=${props.userId}`)
                .then((res: AxiosResponse) => {
                    setStudent(res.data.data)
                    setLoading(false)
                })
                .catch(() => {
                    SnackBarUtils.error('Ошибка загрузки данных студента')
                    setOpen(false)
                })

            setGroups([])
            setGroupsLoading(true)

            axios.get(REACT_APP_ADMIN_STUDENT_EDIT_GETALL_GROUPS + ``)
                .then((res: AxiosResponse) => {
                    const _groups: Array<any> = res.data.data
                    setGroups(_groups)
                    setGroupsLoading(false)
                })
                .catch(() => {
                    SnackBarUtils.error('Ошибка загрузки списка групп')
                    setGroups(false)
                    setGroupsLoading(false)
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
                <DialogTitle id="form-dialog-title">Данные студента (только чтение)</DialogTitle>
                <DialogContent>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={4}>
                            <FormGroup>

                                <TextField
                                    margin="normal"
                                    name="surname"
                                    label="Фамилия"
                                    value={student.surname || 'Загрузка...'}
                                />

                                <TextField
                                    margin="normal"
                                    name="name"
                                    label="Имя"
                                    value={student.name || 'Загрузка...'}
                                />

                                <TextField
                                    margin="normal"
                                    name="patronymic"
                                    label="Отчество"
                                    value={student.patronymic || 'Загрузка...'}
                                />

                                <FormControl margin={'normal'}>
                                    <InputLabel>Пол</InputLabel>
                                    <Select
                                        native
                                        name={'gender'}
                                        value={student.gender || ''}
                                    >
                                        <option aria-label="None" value=""/>
                                        <option value={'мужской'}>Мужской</option>
                                        <option value={'женский'}>Женский</option>
                                    </Select>
                                </FormControl>

                            </FormGroup>
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <FormGroup>

                                <FormControl margin={'normal'}>
                                    <InputLabel>Форма обучения</InputLabel>
                                    <Select
                                        native
                                        name={'formaObuch'}
                                        value={student.formaObuch || ''}
                                    >
                                        <option value={0}>Бюджетная</option>
                                        <option value={1}>Платная</option>
                                    </Select>
                                </FormControl>

                                <FormControl margin={'normal'}>
                                    <InputLabel>Группа</InputLabel>
                                    <Select
                                        native
                                        name={'group'}
                                        value={student.group}
                                        disabled={groupsLoading || !groups?.length}
                                    >
                                        {
                                            !groupsLoading
                                                ?
                                                groups?.length
                                                    ? (
                                                        <>
                                                            {
                                                                [1, 2, 3, 4].map((kurs) => {
                                                                    return <optgroup key={kurs} label={`${kurs} курс`}>
                                                                        {
                                                                            groups.map((el: any, i: number, arr: Array<any>) => {
                                                                                if (kurs === el.kurs) {
                                                                                    return (
                                                                                        <option key={el.id} value={el.id}>{el.groupName}</option>
                                                                                    )
                                                                                } else {

                                                                                }
                                                                            })
                                                                        }
                                                                    </optgroup>
                                                                })
                                                            }
                                                        </>
                                                    )

                                                    : <option key={-2} value={-1}>Ошибка загрузки</option>
                                                : <option key={-1} value={-1}>Загрузка...</option>
                                        }
                                    </Select>
                                </FormControl>

                                <TextField
                                    margin="normal"
                                    name="diplomaId"
                                    label="Номер диплома"
                                    value={student.diplomaId || ''}
                                    disabled={student.kurs !== 4}
                                />

                            </FormGroup>
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <FormGroup>

                                <TextField
                                    margin="normal"
                                    name="kurs"
                                    label="Курс"
                                    value={student.kurs || ''}
                                />

                                <TextField
                                    margin="normal"
                                    name="prikazDate"
                                    label="Дата зачисления"
                                    value={student.prikazDate || ''}
                                />

                                <TextField
                                    margin="normal"
                                    name="startDate"
                                    label="Год зачисления"
                                    value={getLocalDate(student.startDate) || ''}
                                />

                                <TextField
                                    margin="normal"
                                    name="finishDate"
                                    label="Год выпуска"
                                    value={getLocalDate(student.finishDate) || ''}
                                />

                            </FormGroup>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeDialog} color="primary">
                        Закрыть
                    </Button>
                </DialogActions>
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
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(StudentDataModal))
