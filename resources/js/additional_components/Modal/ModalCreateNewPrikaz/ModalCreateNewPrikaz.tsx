import React, {useEffect, useState} from 'react'
import {connect} from "react-redux"
import {withRouter} from "react-router"
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, Grid, InputLabel, Select, TextField, Typography} from "@material-ui/core";
import './ModalCreateNewPrikaz.scss'
import {Loading} from "../../Loading/Loading";
import {DatePicker} from "@material-ui/pickers";
import {downloadImportStudentsTemplate} from "../../../redux/actions/actionsAdmin";
import ModalStudentsCreatePrikazStudentsSelect from "../ModalStudentsCreatePrikazStudentsSelect/ModalStudentsCreatePrikazStudentsSelect";
import axios, {AxiosResponse} from "axios";
import {SnackBarUtils} from "../../SnackBarUtils/SnackBarUtils";
import {REACT_APP_ADMIN_PRIKAZ_CREATE, REACT_APP_ADMIN_PRIKAZ_TYPES} from "../../Routes";
import moment from "moment";

function ModalCreateNewPrikaz(props: any) {
    const [open, setOpen] = useState(false);

    const [prikazNumber, setPrikazNumber] = useState<number | string>('');
    const [prikazDate, setPrikazDate] = useState<string | Date>(new Date());
    const [prikazType, setPrikazType] = useState<string>('');
    const [prikazTypes, setPrikazTypes] = useState<any>([]);
    const [prikazTypesLoading, setPrikazTypesLoading] = useState<boolean>(true);
    const [selectedStudentsIds, setSelectedStudentsIds] = useState<number[]>([]);

    const [loading, setLoading] = useState<boolean>(false);

    //получить список приказов
    useEffect(() => {
        if (open) {
            setPrikazTypesLoading(true)

            axios.get(REACT_APP_ADMIN_PRIKAZ_TYPES + ``)
                .then((r: AxiosResponse) => {
                    setPrikazTypes(r.data.data)
                })
                .catch((e) => {
                    SnackBarUtils.error('Ошибка загрузки приказов')
                })
                .finally(() => {
                    setPrikazTypesLoading(false)
                })
        } else {
            setSelectedStudentsIds([])
        }
    }, [open])

    useEffect(() => {
        if (open) {
            // console.log(selectedStudentsIds)
        } else {

        }
    }, [selectedStudentsIds])

    function openDialog(): void {
        setOpen(true)
    }

    function closeDialog(): void {
        setOpen(false)
    }

    function handleSubmit(): void {
        setLoading(true)
        axios.post(REACT_APP_ADMIN_PRIKAZ_CREATE + ``,
            {
                N: prikazNumber,
                date: moment(prikazDate).format('YYYY-MM-DD'),
                name: prikazType,
                studentIds: JSON.stringify(selectedStudentsIds),
            })
            .then((r: AxiosResponse) => {
                SnackBarUtils.success('Приказ успешно создан')
                props.updateList()
                setOpen(false)
            })
            .catch((e) => {
                SnackBarUtils.error('Ошибка создания приказа')
            })
            .finally(() => {
                setLoading(false)
            })
    }

    function selectStudents(list: any[]): void {
        setSelectedStudentsIds(list)
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
                <DialogTitle id="form-dialog-title">Создание приказа</DialogTitle>
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
                            <FormControl margin={'normal'} style={{width: '100%'}}>
                                <InputLabel>Тип приказа</InputLabel>
                                <Select
                                    native
                                    name={'prikaz'}
                                    disabled={prikazTypesLoading || !prikazTypes?.length}
                                    onChange={(e: any) => {
                                        setPrikazType(e.target.value)
                                    }}
                                >
                                    {
                                        !prikazTypesLoading
                                            ?
                                            prikazTypes?.length
                                                ? (
                                                    <>
                                                        <option aria-label="None" value=""/>
                                                        {
                                                            prikazTypes.map((type: any) => {
                                                                return (
                                                                    <option key={type.id} value={type.name}>
                                                                        {type.title}
                                                                    </option>
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

                            <TextField
                                margin="normal"
                                label="Выбрано студентов"
                                value={selectedStudentsIds?.length}
                                style={{width: '100%'}}
                                disabled={true}
                            />


                            <div>

                                <Typography variant={'body1'} style={{marginBottom: '5px'}}>
                                    Выберите студентов, относящихся к приказу:
                                </Typography>
                                <ModalStudentsCreatePrikazStudentsSelect
                                    selectStudents={(list: number[]) => {
                                        selectStudents(list)
                                    }}
                                />
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
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ModalCreateNewPrikaz))
