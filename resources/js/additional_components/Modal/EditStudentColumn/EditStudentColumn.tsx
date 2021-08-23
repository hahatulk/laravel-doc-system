//ctrl+c ctrl+v material-ui.com editing rows
import React, {useEffect, useState} from "react";
import axios, {AxiosResponse} from "axios";
import {SnackBarUtils} from "../../SnackBarUtils/SnackBarUtils";
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormGroup, Grid, InputLabel, Select, TextField} from "@material-ui/core";
import {Plugin, Template, TemplateConnector, TemplatePlaceholder} from "@devexpress/dx-react-core";
import {DatePicker} from "@material-ui/pickers";
import {getLocalDate} from "../../Dates";
import {REACT_APP_ADMIN_GROUPS} from "../../Routes";

export const getRowId = (row: any) => row.userId
export const Popup = React.memo(({
                                     row,
                                     onChange,
                                     onApplyChanges,
                                     onCancelChanges,
                                     inProgress,
                                     open,
                                 }: any) => {
    const [student, setStudent] = useState<string>('')
    const [groups, setGroups] = useState<any>([])
    const [groupsLoading, setGroupsLoading] = useState<boolean>(true);
    const [_inProgress] = useState<boolean>(inProgress !== undefined ? inProgress : -1);

    useEffect(() => {
        if (open) {
            setGroups([])
            setGroupsLoading(true)
            setStudent(`${row.surname} ${row.name} ${row.patronymic}`)

            axios.get(REACT_APP_ADMIN_GROUPS, {
                params: {
                    inProgress: _inProgress
                }
            })
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
        <Dialog
            open={open}
            fullWidth={true}
            maxWidth={'md'}
            onClose={onCancelChanges}
            aria-labelledby="form-dialog-title"
        >
            <DialogTitle id="form-dialog-title">Редактирование студента {student}</DialogTitle>
            <DialogContent>
                <Grid container spacing={3}>

                    <Grid item xs={12} md={6}>
                        <FormGroup>

                            <TextField
                                margin="normal"
                                name="surname"
                                label="Фамилия"
                                value={row.surname || ''}
                                onChange={onChange}
                            />

                            <TextField
                                margin="normal"
                                name="name"
                                label="Имя"
                                value={row.name || ''}
                                onChange={onChange}
                            />

                            <TextField
                                margin="normal"
                                name="patronymic"
                                label="Отчество"
                                value={row.patronymic || ''}
                                onChange={onChange}
                            />

                            <FormControl margin={'normal'}>
                                <InputLabel>Пол</InputLabel>
                                <Select
                                    native
                                    name={'gender'}
                                    defaultValue={row.gender}
                                    onChange={onChange}
                                >
                                    <option value={'мужской'}>Мужской</option>
                                    <option value={'женский'}>Женский</option>
                                </Select>
                            </FormControl>

                        </FormGroup>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <FormGroup>

                            <FormControl margin={'normal'}>
                                <InputLabel>Форма обучения</InputLabel>
                                <Select
                                    native
                                    name={'formaObuch'}
                                    defaultValue={row.formaObuch}
                                    onChange={onChange}
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
                                    value={row.group}
                                    disabled={groupsLoading || !groups?.length}
                                    onChange={onChange}
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
                                                                                    <option key={el.id} value={el.id}>{el.name}</option>
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


                            <DatePicker
                                margin={'normal'}
                                label="Дата рождения"
                                format="yyyy-MM-dd"
                                value={row.birthday}
                                cancelLabel={'отмена'}
                                onChange={(e: any) => {
                                    onChange({
                                        target: {
                                            name: 'birthday',
                                            value: getLocalDate(e),
                                        }
                                    })
                                }}
                            />

                            <TextField
                                margin="normal"
                                name="diplomaId"
                                label="Номер диплома"
                                value={row.diplomaId || ''}
                                disabled={row.kurs !== 4}
                                onChange={onChange}
                            />
                        </FormGroup>
                    </Grid>

                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={onCancelChanges} color="primary">
                    Отмена
                </Button>
                <Button onClick={onApplyChanges} color="primary">
                    Сохранить
                </Button>
            </DialogActions>
        </Dialog>)
})

export const PopupEditing = React.memo((
    {
        popupComponent: Popup,
        inProgress,
    }: any) => (
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
                            inProgress={inProgress}
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
