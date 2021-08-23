import React, {useCallback, useEffect, useState} from 'react'
import {connect} from "react-redux"
import {withRouter} from "react-router"
import {deleteGroup, editGroup, getGroupsList} from "../../../redux/actions/actionsAdmin";
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
import './Groups.scss'
import {getRowId, Popup, PopupEditing} from '../../../additional_components/Modal/EditGroupColumn/EditGroupColumn';
import _ from "lodash";
import {getLocalDate} from "../../../additional_components/Dates";
import ModalGroupCreate from "../../../additional_components/Modal/ModalGroupCreate/ModalGroupCreate";
import ModalStudents from "../../../additional_components/Modal/ModalStudents/ModalStudents";
import {DxCustomFilter} from '../../../additional_components/DxCustomFilter';
import {editColumnMessages, filterRowMessages} from "../../../additional_components/DxGridLocaleConfig";

function Groups(props: any) {
    const [page, setPage] = useState<number>(0)
    const [pageSize, setPageSize] = useState<number>(6)

    const [rows, setRows] = useState<any>([])
    const [rowCount, setRowCount] = useState<number>(0)

    const [columns] = useState<Column[]>([
        {name: 'id', title: 'ID'},
        {name: 'kurs', title: 'Курс'},
        {name: 'inProgress', title: 'Статус'},
        {name: 'groupName', title: 'Группа'},
        {name: 'groupType', title: 'Очная/заочная'},
        {name: 'facultet', title: 'Отделение'},
        {name: 'studentsList', title: 'Студенты'},
        {name: 'startDate', title: 'Дата создания'},
        {name: 'finishDate', title: 'Дата выпуска'},
        {name: 'delete', title: 'УДАЛЕНИЕ ГРУППЫ'},
    ])
    const [columnsWidth] = useState<TableColumnWidthInfo[]>([
        {columnName: 'id', width: 80},
        {columnName: 'inProgress', width: 100},
        {columnName: 'kurs', width: 80},
        {columnName: 'groupName', width: 100},
        {columnName: 'groupType', width: 120},
        {columnName: 'facultet', width: 160},
        {columnName: 'studentsList', width: 160},
        {columnName: 'startDate', width: 160},
        {columnName: 'finishDate', width: 160},
        {columnName: 'delete', width: 180},
    ])

    const [defaultHiddenColumnNames] = useState<string[]>([
        'id',
        'delete',
    ])
    const [currentHiddenColumnNames, setCurrentHiddenColumnNames] = useState<string[]>(defaultHiddenColumnNames)

    const [filters, setFilters] = useState<Filter[]>([])
    const [filtersNeedReset, setFiltersNeedReset] = useState<boolean>(false)
    const [filteringStateColumnExtensions] = useState([
        {columnName: 'studentsList', filteringEnabled: false},
        {columnName: 'delete', filteringEnabled: false},
    ])

    const [sorting, setSorting] = useState<Sorting[]>([])
    const [sortingStateColumnExtensions] = useState([
        {columnName: 'studentsList', sortingEnabled: false},
        {columnName: 'delete', sortingEnabled: false},
    ])

    const [loading, setLoading] = useState<boolean>(true)

    //обновить список студентов
    function updateList(): void {
        props.getGroupsList(
            page,
            pageSize,
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
        setLoading(props.Admin.groupsList.loading)

    }, [props.Admin.groupsList.loading])

    //обновить лист в компоненте
    useEffect(() => {
        setRows(props.Admin.groupsList.list)
        setRowCount(props.Admin.groupsList.count)

        //сброс страницы на 0 если лист маленький
        if (props.Admin.groupsList.count <= pageSize) {
            setPage(0)
        }
    }, [props.Admin.groupsList.list])

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

            console.log(changed)

            if (editedData) {
                setLoading(true)
                props.editGroup(editedUserId, editedData, () => {
                    updateList()
                })
            }
        }
    };

    //компаратор для специфичных колонок
    const Cell = React.memo((cellProps: any) => {
        const {column, row} = cellProps;

        if (column.name === 'inProgress') {
            return (
                <Table.Cell {...cellProps}>
                    <span>
                        {row.inProgress === 1 ? 'Учится' : row.inProgress === 0 ? 'Выпущена' : ''}
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

        if (column.name === 'groupType') {
            return (
                <Table.Cell {...cellProps}>
                    <span>
                        {row.groupType === 0 ? 'очная' : 'заочная'}
                    </span>
                </Table.Cell>
            )
        }

        if (column.name === 'delete') {
            return (
                <Table.Cell {...cellProps}>
                    <Button color={'secondary'}
                            variant={'contained'}
                            onClick={() => {
                                let sure = window.confirm(`Вы уверены что хотите удалить группу ${row.groupName}?`)

                                if (sure) {
                                    props.deleteGroup(row.id, () => {
                                        updateList()
                                    })
                                }
                            }}
                    >
                        Удалить группу
                    </Button>
                </Table.Cell>
            )
        }

        if (column.name === 'studentsList') {
            return (
                <Table.Cell {...cellProps}>
                    <ModalStudents inProgress={row.inProgress}
                                   groupId={row.id}
                                   groupName={row.groupName}
                    />
                </Table.Cell>
            )
        }

        return <Table.Cell {...cellProps} />;
    })

    return (
        <div className={'Groups_list'}>
            <HeaderBar/>

            <Container className={'Root-container'}>
                <Paper className={'Groups_list_table'} style={{position: 'relative', minHeight: '459px'}}>
                    <div className={"table-description"}>
                        <Typography variant={'h6'} className={'table-title'}>
                            Список групп
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

                            <ModalGroupCreate updateList={() => {
                                updateList()
                            }}/>

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
                        <PopupEditing popupComponent={Popup}/>
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
        editGroup: (
            groupId: number,
            values: any,
            cb?: Function | undefined,
        ) => {
            dispatch(editGroup(groupId, values, cb))
        },
        deleteGroup: (
            groupId: number,
            cb?: Function | undefined,
        ) => {
            dispatch(deleteGroup(groupId, cb))
        },
        getGroupsList: (
            page: string | number,
            per_page: string | number,
            sort?: Sorting[],
            filters?: Filter[],
        ) => {
            dispatch(getGroupsList(page, per_page, sort, filters))
        },
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(React.memo(Groups)))
