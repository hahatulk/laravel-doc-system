import React, {useEffect, useState} from 'react'
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormGroup, Grid, InputLabel, Select, TextField} from "@material-ui/core";
import axios, {AxiosResponse} from "axios";
import {SnackBarUtils} from "../../SnackBarUtils/SnackBarUtils";
import {Loading} from "../../Loading/Loading";
import {withRouter} from "react-router-dom";
import {connect} from "react-redux";
import {DatePicker} from "@material-ui/pickers";
import {REACT_APP_ADMIN_FACULTETS_GET, REACT_APP_ADMIN_GROUPS_CREATE} from "../../Routes";
import moment from "moment";

function ModalGroupCreate(props: any) {
    const [open, setOpen] = useState<boolean>(false);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const [facultetLoading, setFacultetLoading] = useState<boolean>(true);
    const [facultetList, setFacultetList] = useState<any[]>();

    const [kurs, setKurs] = useState<number>(1);
    const [groupName, setGroupName] = useState<string>('');
    const [groupType, setGroupType] = useState<number>(0);
    const [inProgress, setInProgress] = useState<number>(1);
    const [startDate, setStartDate] = useState<Date>(new Date());
    const [finishDate, setFinishDate] = useState<Date>(new Date());
    const [facultet, setFacultet] = useState<string>('');

    function openDialog() {
        setOpen(true)
    }

    function closeDialog() {
        if (!isSubmitting) {
            setOpen(false)
        }
    }

    function handleSubmit() {
        if (!isSubmitting) {
            if (
                groupName !== '' &&
                facultet !== ''
            ) {
                setIsSubmitting(true)

                axios.post(REACT_APP_ADMIN_GROUPS_CREATE + ``, {
                    kurs: kurs,
                    name: groupName,
                    groupType: groupType,
                    inProgress: inProgress,
                    facultet: facultet,
                    startDate: moment(startDate).format('YYYY-MM-DD'),
                    finishDate: moment(finishDate).format('YYYY-MM-DD'),
                })
                    .then((res: AxiosResponse) => {
                        setFacultetList(res.data.data)
                        setFacultetLoading(false)
                        setIsSubmitting(true)
                        setOpen(false)
                        SnackBarUtils.success(`Группа ${groupName} создана`)
                        props.updateList()
                    })
                    .catch(() => {
                        SnackBarUtils.error('Ошибка создания группы')
                        setIsSubmitting(false)
                        setFacultetLoading(false)
                    })
            } else {
                SnackBarUtils.warning('Поля не заполнены')

            }
        }
    }

    useEffect(() => {
        if (open) {
            //подгрузка факультетов
            axios.get(REACT_APP_ADMIN_FACULTETS_GET + ``)
                .then((res: AxiosResponse) => {
                    setFacultetList(res.data.data)
                    setFacultetLoading(false)
                })
                .catch(() => {
                    SnackBarUtils.error('Ошибка загрузки отделений')
                    setFacultetLoading(false)
                })
        } else {
            setKurs(1)
            setIsSubmitting(false)
            setInProgress(1)
            setFacultet('')
            setStartDate(new Date())
            setFinishDate(new Date())
            setGroupType(0)
            setGroupName('')
            setFacultetList([])
            setFacultetLoading(false)
        }
    }, [open])

    return (
        <>
            <Button color={'primary'}
                    variant={'contained'}
                    style={{
                        marginRight: '30px',
                    }}
                    onClick={() => {
                        openDialog()
                    }}
            >
                Создать
            </Button>

            <Dialog
                open={open}
                fullWidth={true}
                maxWidth={'md'}
                onClose={closeDialog}
                aria-labelledby="form-dialog-title"
            >
                <form action="" onSubmit={(e: any) => {
                    e.preventDefault()
                    handleSubmit()
                }}>
                    <DialogTitle id="form-dialog-title">Создание группы</DialogTitle>
                    <DialogContent>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                                <FormGroup>
                                    <TextField
                                        margin="normal"
                                        name="kurs"
                                        label="Курс"
                                        type={'number'}
                                        inputProps={{min: 1, max: 4}}
                                        value={kurs}
                                        onChange={(e: any) => {
                                            const value = e.target.value
                                            if (parseInt(value) <= 4 && parseInt(value) >= 1 || value === '') {
                                                setKurs(value)
                                            } else {
                                                e.preventDefault()
                                            }
                                        }}
                                    />

                                    <FormControl margin={'normal'}>
                                        <InputLabel>Статус группы</InputLabel>
                                        <Select
                                            native
                                            name="inProgress"
                                            defaultValue={1}
                                            onChange={(e: any) => {
                                                setInProgress(e.target.value)
                                            }}
                                        >
                                            <option value={1}>Учится</option>
                                            <option value={0}>Выпущена</option>
                                        </Select>
                                    </FormControl>

                                    <TextField
                                        margin="normal"
                                        name="groupName"
                                        label="Название"
                                        onChange={(e: any) => {
                                            setGroupName(e.target.value)
                                        }}
                                    />

                                    <FormControl margin={'normal'}>
                                        <InputLabel>Очная/заочная</InputLabel>
                                        <Select
                                            native
                                            name="groupType"
                                            defaultValue={0}
                                            onChange={(e: any) => {
                                                setGroupType(e.target.value)
                                            }}
                                        >
                                            <option value={0}>Очная</option>
                                            <option value={1}>Заочная</option>
                                        </Select>
                                    </FormControl>
                                </FormGroup>
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <FormGroup>
                                    <FormControl margin={'normal'}>
                                        <InputLabel>Факультет</InputLabel>
                                        <Select
                                            native
                                            name={'facultet'}
                                            value={facultet}
                                            disabled={facultetLoading || !facultetList?.length}
                                            onChange={(e: any) => {
                                                setFacultet(e.target.value)
                                            }}
                                        >
                                            {
                                                !facultetLoading
                                                    ?
                                                    facultetList?.length
                                                        ? (<>

                                                                <option aria-label="None" value=""/>
                                                                {
                                                                    facultetList.map((el: any, i: number, arr: Array<any>) => {
                                                                        return (
                                                                            <option key={el.id} value={el.name}>{el.name}</option>
                                                                        )
                                                                    })
                                                                }
                                                            </>
                                                        )

                                                        : <option key={-2} value={-1}>Ошибка загрузки</option>
                                                    : <option key={-1} value={-1}>Загрузка...</option>
                                            }
                                        </Select>
                                    </FormControl>

                                    <DatePicker
                                        margin={'normal'}
                                        label="Дата зачисления"
                                        format="yyyy-MM-dd"
                                        value={startDate}
                                        cancelLabel={'отмена'}
                                        onChange={(e: any) => {
                                            setStartDate(e)
                                        }}
                                    />

                                    <DatePicker
                                        margin={'normal'}
                                        label="Дата выпуска"
                                        format="yyyy-MM-dd"
                                        value={finishDate}
                                        cancelLabel={'отмена'}
                                        onChange={(e: any) => {
                                            setFinishDate(e)
                                        }}
                                    />
                                </FormGroup>
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={closeDialog} color="primary">
                            Закрыть
                        </Button>
                        <Button type={'submit'} color="primary">
                            Сохранить
                        </Button>
                    </DialogActions>
                    {!isSubmitting || <Loading/>}
                </form>
            </Dialog>
        </>
    )
}

const mapStateToProps = (state: any) => {
    return {}
}
const mapDispatchToProps = (dispatch: any) => {
    return {}
}
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ModalGroupCreate))
