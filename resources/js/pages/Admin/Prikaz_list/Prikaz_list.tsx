import React, {useCallback, useEffect, useState} from 'react'
import {connect} from "react-redux"
import {withRouter} from "react-router"
import {deletePrikaz, editPrikaz, exportStudents, getPrikazList} from "../../../redux/actions/actionsAdmin";
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
import './Prikaz_list.scss'
import _ from "lodash";
import {getLocalDate} from "../../../additional_components/Dates";
import {getRowId, Popup, PopupEditing} from '../../../additional_components/Modal/EditPrikazColumn/EditPrikazColumn';
import ModalStudentsPrikazLinked from "../../../additional_components/Modal/ModalStudentsPrikazLinked/ModalStudentsPrikazLinked";
import ModalCreateNewPrikaz from "../../../additional_components/Modal/ModalCreateNewPrikaz/ModalCreateNewPrikaz";
import {DxCustomFilter} from "../../../additional_components/DxCustomFilter";
import {editColumnMessages, filterRowMessages} from "../../../additional_components/DxGridLocaleConfig";

function Prikaz_list(props: any) {
    const [page, setPage] = useState<number>(0)
    const [pageSize, setPageSize] = useState<number>(6)

    const [rows, setRows] = useState<any>([])
    const [rowCount, setRowCount] = useState<number>(0)

    const [columns] = useState<Column[]>([
        {name: 'id', title: 'ID'},
        {name: 'N', title: 'Номер'},
        {name: 'title', title: 'Название'},
        {name: 'name', title: 'Тип'},
        {name: 'prikazDate', title: 'Дата создания'},
        {name: 'linkedStudents', title: 'Связанные студенты'},
        {name: 'delete', title: 'Действия'},
    ])
    const [columnsWidth] = useState<TableColumnWidthInfo[]>([
        {columnName: 'id', width: 80},
        {columnName: 'N', width: 100},
        {columnName: 'title', width: 180},
        {columnName: 'name', width: 180},
        {columnName: 'prikazDate', width: 180},
        {columnName: 'linkedStudents', width: 190},
        {columnName: 'delete', width: 190},
    ])


    const [defaultHiddenColumnNames] = useState<string[]>([
        'id',
        'name',
        'delete',
    ])
    const [currentHiddenColumnNames, setCurrentHiddenColumnNames] = useState<string[]>(defaultHiddenColumnNames)

    const [filters, setFilters] = useState<Filter[]>([])
    const [filtersNeedReset, setFiltersNeedReset] = useState<boolean>(false)
    const [filteringStateColumnExtensions] = useState([
        {columnName: 'linkedStudents', filteringEnabled: false},
        // {columnName: 'documentRequestsList', filteringEnabled: false},
    ])

    const [sorting, setSorting] = useState<Sorting[]>([])
    const [sortingStateColumnExtensions] = useState([
        {columnName: 'linkedStudents', sortingEnabled: false},
        // {columnName: 'documentRequestsList', sortingEnabled: false},
    ])

    const [loading, setLoading] = useState<boolean>(true)

    //обновить список студентов
    function updateList(): void {
        props.getPrikazList(
            page,
            sorting,
            filters,
        )
    }

    //задержка перед фильтрацией
    const debouncedSetFilters = useCallback(_.debounce((e) => {
        setFilters(e)
    }, 400), [])

    useEffect(() => {
        updateList()

        // console.log(page * pageSize,( page + 1) * pageSize);
    }, [page, sorting, filters])

    //обновить статус загрузки листа
    useEffect(() => {
        setLoading(props.Admin.prikazList.loading)
    }, [props.Admin.prikazList.loading])

    //обновить лист в компоненте
    useEffect(() => {
        setRows(props.Admin.prikazList.list)
        setRowCount(props.Admin.prikazList.count)

        //сброс страницы на 0 если лист маленький
        if (props.Admin.prikazList.count <= pageSize && filters?.length) {
            setPage(0)
            // console.log(props.Admin.studentsList.count, pageSize);
            // console.log(page);
        }

    }, [props.Admin.prikazList.list])

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

    //отправить запрос на изменение данных приказа
    const commitChanges = ({changed}: any) => {
        // let changedRows;
        if (changed) {
            // changedRows = rows.map((row: any) => (changed[row.id] ? {...row, ...changed[row.id]} : row));

            const editedPrikazId: number = parseInt(Object.keys(changed)[0])
            const editedData: any = changed[editedPrikazId]

            console.log(changed)

            if (editedData) {
                setLoading(true)
                props.editPrikaz(editedPrikazId, editedData, () => {
                    updateList()
                })
            }
        }
    };

    //компаратор для специфичных колонок
    const Cell = React.memo((cellProps: any) => {
        const {column, row} = cellProps;

        if (column.name === 'prikazDate') {
            return (
                <Table.Cell {...cellProps}>
                    <span>
                        {getLocalDate(row.prikazDate)}
                    </span>
                </Table.Cell>
            )
        }

        if (column.name === 'linkedStudents') {
            return (
                <Table.Cell {...cellProps}>
                    <ModalStudentsPrikazLinked prikazNumber={row.N}/>
                </Table.Cell>
            )
        }

        if (column.name === 'delete') {
            return (
                <Table.Cell {...cellProps}>
                    <Button color={'secondary'}
                            variant={'contained'}
                            onClick={() => {
                                let sure = window.confirm(`Вы уверены что хотите удалить приказ ${row.title} № ${row.N}?`)

                                if (sure) {
                                    props.deletePrikaz(row.id, () => {
                                        updateList()
                                    })
                                }
                            }}
                    >
                        УДАЛИТЬ
                    </Button>
                </Table.Cell>
            )
        }

        return <Table.Cell {...cellProps} />;
    })

    return (
        <div className={'Prikaz_list'}>
            <HeaderBar/>

            <Container className={'Root-container'}>
                <Paper className={'Prikaz_list_table'} style={{position: 'relative', minHeight: '459px'}}>
                    <div className={"table-description"}>
                        <Typography variant={'h6'} className={'table-title'}>
                            Список приказов
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

                            <ModalCreateNewPrikaz updateList={() => {
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
        editPrikaz: (prikazId: number, values: any, cb: Function) => {
            dispatch(editPrikaz(prikazId, values, cb))
        },
        deletePrikaz: (
            prikazId: number,
            cb?: Function | undefined,
        ) => {
            dispatch(deletePrikaz(prikazId, cb))
        },
        exportStudents: (restrictedColumns: any[], filters: any[], inProgress: number) => {
            dispatch(exportStudents(restrictedColumns, filters, inProgress))
        },
        getPrikazList: (
            page: string | number,
            sort?: Sorting[],
            filters?: Filter[],
        ) => {
            dispatch(getPrikazList( page, sort, filters))
        },
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(React.memo(Prikaz_list)))