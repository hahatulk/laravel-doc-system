//ctrl+c ctrl+v material-ui.com editing rows
import React, {useEffect, useRef, useState} from "react";
import axios, {AxiosResponse} from "axios";
import {SnackBarUtils} from "../../SnackBarUtils/SnackBarUtils";
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormGroup, Grid, InputLabel, Select, TextField} from "@material-ui/core";
import {Plugin, Template, TemplateConnector, TemplatePlaceholder} from "@devexpress/dx-react-core";
import {DatePicker} from "@material-ui/pickers";
import {REACT_APP_ADMIN_FACULTETS_GET} from "../../Routes";

export const getRowId = (row: any) => row.id

export const Popup = React.memo(({
                                     row,
                                     onChange,
                                     onApplyChanges,
                                     onCancelChanges,
                                     open,
                                 }: any) => {
    const [facultetLoading, setFacultetLoading] = useState<boolean>(true);
    const [facultetList, setFacultetList] = useState<any[]>();
    const facultetRef: any = useRef();

    const [kurs, setKurs] = useState<number>();
    const [groupName, setGroupName] = useState<number>();


    useEffect(() => {
        if (open) {
            setKurs(row.kurs)
            setGroupName(row.groupName)
            axios.get(REACT_APP_ADMIN_FACULTETS_GET + ``)
                .then((res: AxiosResponse) => {
                    setFacultetList(res.data.data)
                    setFacultetLoading(false)
                    if (facultetRef) {
                        if (facultetRef?.current?.querySelector('select')) {
                            if (row.facultet !== facultetRef?.current.querySelector('select').value) {
                                facultetRef.current.querySelector('select').value = row.facultet
                            }
                        }
                    }
                })
                .catch((e) => {
                    console.log(e)
                    SnackBarUtils.error('Ошибка загрузки отделений')
                    setFacultetLoading(false)
                })
        }
    }, [open])

    return (
        <Dialog
            open={open}
            fullWidth={true}
            maxWidth={'md'}
            onClose={onCancelChanges}
            aria-labelledby="form-dialog-title"
        >
            <DialogTitle id="form-dialog-title">Редактирование группы {groupName}</DialogTitle>
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
                                        onChange(e)
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
                                    defaultValue={row.inProgress}
                                    onChange={onChange}
                                >
                                    <option value={1}>Учится</option>
                                    <option value={0}>Выпущена</option>
                                </Select>
                            </FormControl>

                            <TextField
                                margin="normal"
                                name="groupName"
                                label="Название"
                                value={row.groupName || ''}
                                onChange={onChange}
                            />

                            <FormControl margin={'normal'}>
                                <InputLabel>Очная/заочная</InputLabel>
                                <Select
                                    native
                                    name="groupType"
                                    defaultValue={row.groupType}
                                    onChange={onChange}
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
                                    defaultValue={row.facultet}
                                    ref={facultetRef}
                                    disabled={facultetLoading || !facultetList?.length}
                                    onChange={onChange}
                                >
                                    {
                                        !facultetLoading
                                            ?
                                            facultetList?.length
                                                ? (
                                                    facultetList.map((el: any, i: number, arr: Array<any>) => {
                                                        return (
                                                            <option key={el.id} value={el.name}>{el.name}</option>
                                                        )
                                                    })
                                                )

                                                : <option key={-2} value={-1}>Ошибка загрузки</option>
                                            : <option key={-1} value={-1}>Загрузка...</option>
                                    }
                                </Select>
                            </FormControl>


                            <DatePicker
                                margin={'normal'}
                                name={'startDate'}
                                label="Дата зачисления"
                                format="yyyy-MM-dd"
                                value={row.startDate}
                                cancelLabel={'отмена'}
                                onChange={(e: any) => {
                                    onChange({
                                        target: {
                                            name: 'startDate',
                                            value: new Date(e).getTime(),
                                        }
                                    })
                                }}
                            />

                            <DatePicker
                                margin={'normal'}
                                name={'finishDate'}
                                label="Дата выпуска"
                                format="yyyy-MM-dd"
                                value={row.finishDate}
                                cancelLabel={'отмена'}
                                onChange={(e: any) => {
                                    onChange({
                                        target: {
                                            name: 'finishDate',
                                            value: new Date(e).getTime(),
                                        }
                                    })
                                }}
                            />
                        </FormGroup>
                    </Grid>

                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={onCancelChanges} color="primary">
                    Закрыть
                </Button>
                <Button onClick={onApplyChanges} color="primary">
                    Сохранить
                </Button>
            </DialogActions>
        </Dialog>)
})

export const PopupEditing = React.memo(({popupComponent: Popup}: any) => (
    <Plugin>
        <Template name="popupEditing">
            <TemplateConnector>
                {(
                    {
                        rows,
                        getRowId,
                        addedRows,
                        editingRowIds,
                        createRowChange,
                        rowChanges,
                    },
                    {
                        changeRow, changeAddedRow, commitChangedRows, commitAddedRows,
                        stopEditRows, cancelAddedRows, cancelChangedRows,
                    },
                ) => {
                    const isNew = addedRows.length > 0;
                    let editedRow: any;
                    let rowId: any;
                    if (isNew) {
                        rowId = 0;
                        editedRow = addedRows[rowId];
                    } else {
                        [rowId] = editingRowIds;
                        const targetRow = rows.filter((row: any) => getRowId(row) === rowId)[0];
                        editedRow = {...targetRow, ...rowChanges[rowId]};
                    }

                    const processValueChange = ({target: {name, value}}: any) => {
                        const changeArgs = {
                            rowId,
                            change: createRowChange(editedRow, value, name),
                        };
                        if (isNew) {
                            changeAddedRow(changeArgs);
                        } else {
                            changeRow(changeArgs);
                        }
                    };
                    const rowIds = isNew ? [0] : editingRowIds;
                    const applyChanges = () => {
                        if (isNew) {
                            commitAddedRows({rowIds});
                        } else {
                            stopEditRows({rowIds});
                            commitChangedRows({rowIds});
                        }
                    };
                    const cancelChanges = () => {
                        if (isNew) {
                            cancelAddedRows({rowIds});
                        } else {
                            stopEditRows({rowIds});
                            cancelChangedRows({rowIds});
                        }
                    };

                    const open = editingRowIds.length > 0 || isNew;

                    return (
                        <Popup
                            open={open}
                            row={editedRow}
                            onChange={processValueChange}
                            onApplyChanges={applyChanges}
                            onCancelChanges={cancelChanges}
                        />
                    );
                }}
            </TemplateConnector>
        </Template>
        <Template name="root">
            <TemplatePlaceholder/>
            <TemplatePlaceholder name="popupEditing"/>
        </Template>
    </Plugin>
))
