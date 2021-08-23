import React, {useCallback, useEffect, useState} from 'react'
import {connect} from "react-redux"
import {withRouter} from "react-router"
import {Loading} from '../../Loading/Loading';
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography} from "@material-ui/core";
import {
    ColumnChooser,
    Grid as DxGrid,
    PagingPanel,
    Table,
    TableColumnResizing,
    TableColumnVisibility,
    TableEditColumn,
    TableFilterRow,
    TableHeaderRow,
    TableSelection,
    Toolbar
} from "@devexpress/dx-react-grid-material-ui";
import {Column, CustomPaging, EditingState, Filter, FilteringState, PagingState, SelectionState, Sorting, SortingState, TableColumnWidthInfo} from "@devexpress/dx-react-grid";
import {getLocalDate} from "../../Dates";
import axios from "axios";
import {SnackBarUtils} from "../../SnackBarUtils/SnackBarUtils";
import {getRowId, Popup, PopupEditing} from "../EditStudentColumn/EditStudentColumn";
import _ from "lodash";
import StudentUserDataModal from "../ModalUserData/ModalUserData";
import ModalOrders from "../ModalOrders/ModalOrders";
import {editStudent, exportStudents, exportStudentsWithCredentials} from "../../../redux/actions/actionsAdmin";
import ModalPrikazZachislenie from "../ModalPrikazZachislenie/ModalPrikazZachislenie";
import {DxCustomFilter} from "../../DxCustomFilter";
import {editColumnMessages, filterRowMessages} from "../../DxGridLocaleConfig";
import {REACT_APP_ADMIN_STUDENTS_LINKED_TO_PRIKAZ, REACT_APP_ADMIN_STUDENTS_LIST_GET} from "../../Routes";

function ModalStudents(props: any) {
    const [groupId] = useState<undefined | number>(props.groupId ? props.groupId : '')
    const [groupName] = useState<undefined | string>(props.groupName ? props.groupName : '')
    const [inProgress] = useState<undefined | string>(props.inProgress !== undefined ? props.inProgress : -1)
    const [prikazNumber] = useState<undefined | number>(props.prikazNumber)

    const [open, setOpen] = useState<boolean>(false)

    const [page, setPage] = useState<number>(0)
    const [pageSize, setPageSize] = useState<number>(6)

    const [rows, setRows] = useState<any>([])
    const [rowCount, setRowCount] = useState<number>(0)

    const [columns] = useState<Column[]>([
        {name: 'userId', title: 'ID аккаунта'},
        {name: 'kurs', title: 'Курс'},
        {name: 'groupName', title: 'Группа'},
        {name: 'formaObuch', title: 'Форма обучения'},
        {name: 'surname', title: 'Фамилия'},
        {name: 'name', title: 'Имя'},
        {name: 'patronymic', title: 'Отчество'},
        {name: 'gender', title: 'Пол'},
        {name: 'birthday', title: 'Дата рождения'},
        {name: 'age', title: 'Возраст'},
        {name: 'diplomaId', title: 'Номер диплома'},
        {name: 'prikaz', title: 'Зачислен по приказу (№)'},
        {name: 'startDate', title: 'Начало обучения'},
        {name: 'finishDate', title: 'Конец обучения'},
        {name: 'documentRequestsList', title: 'Заказы'},
        {name: 'userData', title: 'Данные аккаунта'},
    ])
    const [columnsWidth] = useState<TableColumnWidthInfo[]>([
        {columnName: 'userId', width: 160},
        {columnName: 'kurs', width: 80},
        {columnName: 'groupName', width: 100},
        {columnName: 'formaObuch', width: 160},
        {columnName: 'surname', width: 180},
        {columnName: 'name', width: 180},
        {columnName: 'patronymic', width: 180},
        {columnName: 'gender', width: 100},
        {columnName: 'birthday', width: 150},
        {columnName: 'age', width: 150},
        {columnName: 'diplomaId', width: 160},
        {columnName: 'prikaz', width: 160},
        {columnName: 'startDate', width: 160},
        {columnName: 'finishDate', width: 160},
        {columnName: 'documentRequestsList', width: 180},
        {columnName: 'userData', width: 180},
    ])

    const [defaultHiddenColumnNames] = useState<string[]>([
        'userId',
        'groupName',
        'formaObuch',
        'prikaz',
        'startDate',
        'finishDate',
        'userData',
        'diplomaId',
    ])
    const [currentHiddenColumnNames, setCurrentHiddenColumnNames] = useState<string[]>(defaultHiddenColumnNames)

    const [defaultFilters] = useState<Filter[]>(props.groupName ? [{
        columnName: 'groupName',
        operation: 'contains',
        value: groupName,
    }] : [])
    const [filters, setFilters] = useState<Filter[]>(defaultFilters)
    const [filtersNeedReset, setFiltersNeedReset] = useState<boolean>(false)
    const [filteringStateColumnExtensions] = useState([
        {columnName: 'groupName', filteringEnabled: false},
        {columnName: 'userData', filteringEnabled: false},
        {columnName: 'documentRequestsList', filteringEnabled: false},
    ])

    const [sorting, setSorting] = useState<Sorting[]>([])
    const [sortingStateColumnExtensions] = useState([
        {columnName: 'groupName', sortingEnabled: false},
        {columnName: 'userData', sortingEnabled: false},
        {columnName: 'documentRequestsList', sortingEnabled: false},
    ])

    const [loading, setLoading] = useState<boolean>(true)

    function openDialog() {
        setOpen(true)
    }

    function closeDialog() {
        setOpen(false)
    }

    //обновить список студентов
    function updateList(): void {
        setLoading(true)

        //если список нужен по выбранному приказу
        if (prikazNumber !== undefined) {
            axios.get(REACT_APP_ADMIN_STUDENTS_LINKED_TO_PRIKAZ + ``,
                {
                    params: {
                        page: Number(page) + 1,
                        per_page: pageSize,
                        sort: sorting?.length ? JSON.stringify(sorting) : undefined,
                        filters: filters?.length ? JSON.stringify(filters) : undefined,
                        inProgress: inProgress,
                        prikazNumber: prikazNumber
                    }
                }
            )
                .then((res) => {
                    setRows(res.data.data.data)
                    setRowCount(res.data.data.total)
                    setLoading(false)
                })
                .catch(e => {
                    SnackBarUtils.error('Ошибка загрузки списка')
                })
        } else {
            axios.get(REACT_APP_ADMIN_STUDENTS_LIST_GET + ``,
                {
                    params: {
                        page: Number(page) + 1,
                        sort: sorting?.length ? JSON.stringify(sorting) : undefined,
                        filters: filters?.length ? JSON.stringify(filters) : undefined,
                        inProgress: inProgress
                    },
                }
            )
                .then((res) => {
                    setRows(res.data.data.data)
                    setRowCount(res.data.data.total)
                    setLoading(false)
                })
                .catch(e => {
                    SnackBarUtils.error('Ошибка загрузки списка')
                })
        }
    }

    //задержка перед фильтрацией
    const debouncedSetFilters = useCallback(_.debounce((e) => {
        setFilters([...e, ...defaultFilters])
    }, 400), [])

    //получать новый лист при изменении параметров
    useEffect(() => {
        if (open) {
            updateList()
        }
    }, [page, sorting, filters, open])

    //получать новый лист при изменении параметров
    useEffect(() => {
        if (!open) {
            setFilters(defaultFilters)
        }
    }, [open])

    //обновить лист в компоненте
    useEffect(() => {
        //сброс страницы на 0 если лист маленький
        if (rowCount <= pageSize && filters?.length && open) {
            setPage(0)
        }

    }, [rows])

    //если список с выделением, кидать выделенные через функц
    const [selectable] = useState<string>(props.selectable)
    const [selection, setSelection] = useState([]);
    useEffect(() => {
        if (open && selectable) {
        }
    }, [selection])

    //кастомный хендлер сортинга для сброса сортировки на 3-е нажатие
    const onSortingChange = (newColumnsSort: Array<any>) => {
        let indexToRemove = -1;
        newColumnsSort.forEach((column, index) => {
            let columnToCheck = sorting.filter(
                (c) => c.columnName === column.columnName
            );

            if (
                columnToCheck?.length > 0 &&
                columnToCheck[0].direction !== column.direction &&
                column.direction === "asc"
            ) {
                indexToRemove = index;
            }
        });
        if (indexToRemove > -1) newColumnsSort.splice(indexToRemove, 1);
        setSorting(newColumnsSort);
    }

    //отправить запрос на изменение данных студента
    const commitChanges = ({changed}: any) => {
        // let changedRows;
        if (changed) {
            // changedRows = rows.map((row: any) => (changed[row.id] ? {...row, ...changed[row.id]} : row));

            const editedUserId: number = parseInt(Object.keys(changed)[0])
            const editedData: any = changed[editedUserId]

            // console.log(changed)

            if (editedData) {
                setLoading(true)
                props.editStudent(editedUserId, editedData, () => {
                    updateList()
                })
            }
        }
    };

    //компонент форматирования формы обучения
    const FormaObuchComponent = React.memo(({value, style, row, column, tableRow, ...restProps}: any) => {
        return (
            <Table.Cell
                {...restProps}
            >
                <span
                >
                    {row.formaObuch ? 'платная' : 'бюджетная'}
                 </span>
            </Table.Cell>
        )
    })

    //компонент просмотра инфы о акке студента
    const StudentLoginData = React.memo(({value, style, row, column, tableRow, ...restProps}: any) => {
        return (
            <Table.Cell
                {...restProps}
            >
                <StudentUserDataModal userId={row.userId}/>
            </Table.Cell>
        )
    })

    const DocumentRequestsList = React.memo(({value, style, row, column, tableRow, ...restProps}: any) => {
        const studentName = `${row.surname} ${row.name} ${row.patronymic} `

        return (
            <Table.Cell
                {...restProps}
            >
                <ModalOrders studentName={studentName} userId={row.userId}/>
            </Table.Cell>
        )
    })

    //компаратор для специфичных колонок
    const Cell = React.memo((cellProps: any) => {
        const {column, row} = cellProps;

        if (column.name === 'birthday') {
            return (
                <Table.Cell {...cellProps}>
                    <span>
                        {getLocalDate(row.birthday)}
                    </span>
                </Table.Cell>
            )
        }

        if (column.name === 'startDate') {
            return (
                <Table.Cell {...cellProps}>
                    <span>
                        {getLocalDate(row.startDate)}
                    </span>
                </Table.Cell>
            )
        }

        if (column.name === 'finishDate') {
            return (
                <Table.Cell {...cellProps}>
                    <span>
                        {getLocalDate(row.finishDate)}
                    </span>
                </Table.Cell>
            )
        }

        if (column.name === 'userData') {
            return <StudentLoginData {...cellProps} />;
        }

        if (column.name === 'documentRequestsList') {
            return <DocumentRequestsList {...cellProps} />;
        }

        if (column.name === 'formaObuch') {
            return <FormaObuchComponent {...cellProps} />;
        }

        return <Table.Cell {...cellProps} />;
    })

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
                maxWidth={'lg'}
                fullWidth={true}
                onClose={closeDialog}
                aria-labelledby="form-dialog-title"
            >
                <DialogTitle id="form-dialog-title" style={{padding: '16px 24px 0 24px'}}>
                    <div className={"table-description"}>
                        <Typography variant={'h6'}>
                            Студенты {groupName}
                        </Typography>
                        <div className={'table-controls'}>

                            {
                                groupName !== undefined
                                    ? <>
                                        <ModalPrikazZachislenie
                                            groupId={groupId}
                                            groupName={props.groupName}
                                            updateList={() => {
                                                updateList()
                                            }}
                                        />

                                        <Button color={'primary'}
                                                variant={'contained'}
                                                style={{marginRight: '25px'}}
                                                onClick={() => {
                                                    props.exportStudents(currentHiddenColumnNames, filters, props.inProgress)
                                                }}
                                        >
                                            Экспорт
                                        </Button>

                                        <Button color={'primary'}
                                                variant={'contained'}
                                                style={{marginRight: '25px'}}
                                                onClick={() => {
                                                    props.exportStudentsWithCredentials(currentHiddenColumnNames, filters, props.inProgress)
                                                }}
                                        >
                                            Экспорт данных для входа
                                        </Button></>
                                    : ''
                            }


                            <Button color={'primary'}
                                    variant={'contained'}
                                    onClick={() => {
                                        updateList()
                                    }}
                            >
                                Обновить
                            </Button>
                        </div>
                    </div>
                </DialogTitle>
                <DialogContent style={{padding: '0'}}>
                    <DxGrid
                        rows={rows}
                        columns={columns}
                        getRowId={getRowId}
                    >
                        <Toolbar/>
                        <FilteringState
                            columnExtensions={filteringStateColumnExtensions}
                            onFiltersChange={debouncedSetFilters}
                        />
                        <SortingState
                            sorting={sorting}
                            onSortingChange={onSortingChange}
                            columnExtensions={sortingStateColumnExtensions}
                        />
                        <PagingState
                            currentPage={page}
                            onCurrentPageChange={setPage}
                            pageSize={pageSize}
                        />
                        <CustomPaging
                            totalCount={rowCount}
                        />
                        <EditingState
                            onCommitChanges={commitChanges}
                        />
                        {selectable && <SelectionState
                            selection={selection}
                            // @ts-ignore
                            onSelectionChange={setSelection}
                        />}
                        <Table
                            cellComponent={Cell}
                        />
                        <TableColumnResizing
                            defaultColumnWidths={columnsWidth}
                        />
                        <TableColumnVisibility
                            defaultHiddenColumnNames={defaultHiddenColumnNames}
                            onHiddenColumnNamesChange={setCurrentHiddenColumnNames}

                        />
                        <TableHeaderRow
                            showSortingControls
                        />
                        <TableEditColumn
                            showEditCommand
                            messages={editColumnMessages}
                        />


                        {selectable && <TableSelection/>}
                        <PopupEditing popupComponent={Popup}
                                      inProgress={inProgress}/>
                        <TableFilterRow
                            messages={filterRowMessages}
                            editorComponent={(p: any) => (
                                <DxCustomFilter
                                    filtersNeedReset={filtersNeedReset}
                                    setFiltersNeedReset={setFiltersNeedReset}
                                    {...p}/>
                            )}
                        />
                        <PagingPanel/>
                        <ColumnChooser/>

                    </DxGrid>
                    {loading && <Loading/>}
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeDialog} color="primary">
                        Закрыть
                    </Button>
                </DialogActions>
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
        editStudent: (userId: number, values: any, cb: Function) => {
            dispatch(editStudent(userId, values, cb))
        },
        exportStudentsWithCredentials: (restrictedColumns: any[], filters: any[], inProgress: number) => {
            dispatch(exportStudentsWithCredentials(restrictedColumns, filters, inProgress))
        },
        exportStudents: (restrictedColumns: any[], filters: any[], inProgress: number) => {
            dispatch(exportStudents(restrictedColumns, filters, inProgress))
        },
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ModalStudents))
