//ctrl+c ctrl+v material-ui.com editing rows
import React, {useEffect, useState} from "react";
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormGroup, Grid, InputLabel, Select, TextField} from "@material-ui/core";
import {Plugin, Template, TemplateConnector, TemplatePlaceholder} from "@devexpress/dx-react-core";
import {DatePicker} from "@material-ui/pickers";
import axios, {AxiosResponse} from "axios";
import {SnackBarUtils} from "../../SnackBarUtils/SnackBarUtils";
import {getLocalDate} from "../../Dates";
import {REACT_APP_ADMIN_PRIKAZ_TYPES} from "../../Routes";

export const getRowId = (row: any) => row.id

export const Popup = React.memo(({
                                     row,
                                     onChange,
                                     onApplyChanges,
                                     onCancelChanges,
                                     open,
                                 }: any) => {
    const [prikazTypes, setPrikazTypes] = useState<any>([]);
    const [prikazTypesLoading, setPrikazTypesLoading] = useState<boolean>(true);
    const [prikazZachislenieName] = useState<string>('prikaz_o_zachislenii');


    //получить список приказов
    useEffect(() => {
        if (open) {
            setPrikazTypesLoading(true)

            axios.get(REACT_APP_ADMIN_PRIKAZ_TYPES)
                .then((r: AxiosResponse) => {
                    setPrikazTypes(r.data.data)
                })
                .catch((e) => {
                    SnackBarUtils.error('Ошибка загрузки приказов')
                })
                .finally(() => {
                    setPrikazTypesLoading(false)
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
            <DialogTitle id="form-dialog-title">Ввод реквизитов</DialogTitle>
            <DialogContent>
                <Grid container spacing={3}>

                    <Grid item xs={12} md={6}>
                        <FormGroup>

                            <TextField
                                margin="normal"
                                name="N"
                                label="Номер приказа"
                                type={''}
                                value={row.N || ''}
                                style={{width: '100%'}}
                                onChange={(e: any) => {
                                    const value = e.target.value
                                    if (!isNaN(parseInt(value)) || value === '') {
                                        onChange({
                                            target: {
                                                name: 'N',
                                                value: value,
                                            }
                                        })
                                    } else {
                                        e.preventDefault()
                                    }
                                }}
                            />

                            <DatePicker
                                margin={'normal'}
                                name={'date'}
                                label="Дата создания"
                                format="yyyy-MM-dd"
                                value={row.date}
                                cancelLabel={'отмена'}
                                onChange={(e: any) => {
                                    onChange({
                                        target: {
                                            name: 'date',
                                            value: getLocalDate(new Date(e)),
                                        }
                                    })
                                }}
                            />
                        </FormGroup>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <FormGroup>
                            <FormControl margin={'normal'} style={{width: '100%'}}>
                                <InputLabel>Тип приказа</InputLabel>
                                <Select
                                    native
                                    name={'name'}
                                    value={row.name}
                                    disabled={prikazTypesLoading || !prikazTypes?.length || row.name === prikazZachislenieName}
                                    onChange={onChange}
                                >
                                    {
                                        !prikazTypesLoading
                                            ?
                                            prikazTypes?.length
                                                ? (
                                                    <>
                                                        {
                                                            row.name !== prikazZachislenieName
                                                                ? prikazTypes.map((type: any) => {
                                                                    return (
                                                                        <option key={type.id} value={type.name}>
                                                                            {type.title}
                                                                        </option>
                                                                    )
                                                                })
                                                                : <option key={-2} value={-1}>Изменение недоступно</option>

                                                        }
                                                    </>
                                                )

                                                : <option key={-2} value={-1}>Ошибка загрузки</option>
                                            : <option key={-1} value={-1}>Загрузка...</option>
                                    }
                                </Select>
                            </FormControl>
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
