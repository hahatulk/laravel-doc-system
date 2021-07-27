import React, {useCallback, useEffect, useState} from 'react'
import {connect} from "react-redux"
import {withRouter} from "react-router"
import {editStudent, exportStudents, getStudentsList} from "../../../redux/actions/actionsAdmin";
import Paper from '@material-ui/core/Paper';
import {Column, CustomPaging, EditingState, Filter, FilteringState, PagingState, Sorting, SortingState, TableColumnWidthInfo,} from '@devexpress/dx-react-grid';
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
    Toolbar,
} from '@devexpress/dx-react-grid-material-ui';
import {Loading} from '../../../additional_components/Loading/Loading';
import HeaderBar from '../../../additional_components/HeaderBar/HeaderBar';
import {Button, Container, Typography} from "@material-ui/core";
import './Students_list.scss'
import Link from "../../../additional_components/HOC/ProtectedLink";
import StudentUserDataModal from "../../../additional_components/ModalUserData/ModalUserData";
import {getRowId, Popup, PopupEditing} from '../../../additional_components/EditStudentColumn/EditStudentColumn';
import ModalOrders from "../../../additional_components/ModalOrders/ModalOrders";
import _ from "lodash";
import {getLocalDate} from "../../../additional_components/Dates";
import {DxCustomFilter} from '../../../additional_components/DxCustomFilter';
import {editColumnMessages, filterRowMessages} from "../../../additional_components/DxGridLocaleConfig";

function Students_list(props: any) {
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
        {name: 'prikazDate', title: 'Дата зачисления'},
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
        {columnName: 'age', width: 120},
        {columnName: 'diplomaId', width: 160},
        {columnName: 'prikaz', width: 160},
        {columnName: 'prikazDate', width: 160},
        {columnName: 'startDate', width: 160},
        {columnName: 'finishDate', width: 160},
        {columnName: 'documentRequestsList', width: 180},
        {columnName: 'userData', width: 180},
    ])


    const [defaultHiddenColumnNames] = useState<string[]>([
        'userId',
        'formaObuch',
        'prikaz',
        'prikazDate',
        'startDate',
        'finishDate',
        'userData',
        'diplomaId',
    ])
    const [currentHiddenColumnNames, setCurrentHiddenColumnNames] = useState<string[]>(defaultHiddenColumnNames)

    const [filters, setFilters] = useState<Filter[]>([])
    const [filtersNeedReset, setFiltersNeedReset] = useState<boolean>(false)
    const [filteringStateColumnExtensions] = useState([
        {columnName: 'userData', filteringEnabled: false},
        {columnName: 'documentRequestsList', filteringEnabled: false},
    ])

    const [sorting, setSorting] = useState<Sorting[]>([])
    const [sortingStateColumnExtensions] = useState([
        {columnName: 'userData', sortingEnabled: false},
        {columnName: 'documentRequestsList', sortingEnabled: false},
    ])

    const [loading, setLoading] = useState<boolean>(true)

    //обновить список студентов
    function updateList(): void {
        props.getStudentsList(
            pageSize,
            page * pageSize,
            page,
            sorting,
            filters,
        )
    }

    //задержка перед фильтрацией
    const debouncedSetFilters = useCallback(_.debounce((e) => {
        setFilters(e)
    }, 400), [])

    //получать новый лист при изменении параметров
    useEffect(() => {
        updateList()

        // console.log(page * pageSize,( page + 1) * pageSize);
    }, [page, sorting, filters])

    //обновить статус загрузки листа
    useEffect(() => {
        setLoading(props.Admin.studentsList.loading)

    }, [props.Admin.studentsList.loading])

    //обновить лист в компоненте
    useEffect(() => {
        setRows(props.Admin.studentsList.list)
        setRowCount(props.Admin.studentsList.count)

        //сброс страницы на 0 если лист маленький
        if (props.Admin.studentsList.count <= pageSize && filters?.length) {
            setPage(0)
            // console.log(props.Admin.studentsList.count, pageSize);
            // console.log(page);
        }

    }, [props.Admin.studentsList.list])

    //кастомный хендлер сортинга для сброса сортировки на 3-е нажатие
    const onSortingChange = (newColumnsSort: Array<any>) => {
        let indexToRemove = -1;
        newColumnsSort.forEach((column, index) => {
            let columnToCheck = sorting.filter(
                (c) => c.columnName === column.columnName
            );

            if (
                columnToCheck.length > 0 &&
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
        <div className={'Students_list'}>
            <HeaderBar/>

            <Container className={'Root-container'}>
                <Paper className={'Student_list_table'} style={{position: 'relative', minHeight: '459px'}}>
                    <div className={"table-description"}>
                        <Typography variant={'h6'} className={'table-title'}>
                            Список студентов
                        </Typography>
                        <Button color={'primary'}
                                variant={'contained'}
                                disabled={!filters?.length}
                                onClick={() => {
                                    setFiltersNeedReset(true)
                                }}
                        >
                            Сброс фильтров
                        </Button>
                        <div className={'table-controls'}>
                            <Link to={'/students/archived'}>

                                <Button color={'primary'}
                                        variant={'contained'}
                                        style={{
                                            marginRight: '30px',
                                        }}
                                >
                                    Архив
                                </Button>
                            </Link>
                            <Button color={'primary'}
                                    variant={'contained'}
                                    style={{
                                        marginRight: '30px',
                                    }}
                                    onClick={() => {
                                        props.exportStudents(currentHiddenColumnNames, filters)
                                    }}
                            >
                                Экспорт
                            </Button>
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
                        <TableFilterRow
                            messages={filterRowMessages}
                            editorComponent={(p: any) => (
                                <DxCustomFilter
                                    filtersNeedReset={filtersNeedReset}
                                    setFiltersNeedReset={setFiltersNeedReset}
                                    {...p}/>
                            )}
                        />
                        <PopupEditing popupComponent={Popup}/>
                        <PagingPanel/>
                        <ColumnChooser/>

                    </DxGrid>
                    {loading && <Loading/>}
                </Paper>
            </Container>
        </div>
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
        exportStudents: (restrictedColumns: any[], filters: any[], type?: string | undefined) => {
            dispatch(exportStudents(restrictedColumns, filters, type))
        },
        getStudentsList: (
            limit: string | number,
            offset: string | number,
            page: string | number,
            sort?: Sorting[],
            filters?: Filter[],
        ) => {
            dispatch(getStudentsList(limit, offset, page, sort, filters))
        },
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(React.memo(Students_list)))