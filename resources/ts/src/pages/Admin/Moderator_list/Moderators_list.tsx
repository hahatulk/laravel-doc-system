import React, {useCallback, useEffect, useState} from 'react'
import {connect} from "react-redux"
import {withRouter} from "react-router"
import {deleteModerator, getModeratorsList} from "../../../redux/actions/actionsAdmin";
import Paper from '@material-ui/core/Paper';
import {Column, CustomPaging, Filter, FilteringState, PagingState, Sorting, SortingState, TableColumnWidthInfo,} from '@devexpress/dx-react-grid';
import {ColumnChooser, Grid as DxGrid, PagingPanel, Table, TableColumnResizing, TableColumnVisibility, TableFilterRow, TableHeaderRow, Toolbar,} from '@devexpress/dx-react-grid-material-ui';
import {Loading} from '../../../additional_components/Loading/Loading';
import HeaderBar from '../../../additional_components/HeaderBar/HeaderBar';
import {Button, Container, Typography} from "@material-ui/core";
import './Moderators_list.scss'
import _ from "lodash";
import {getRowId} from '../../../additional_components/EditPrikazColumn/EditPrikazColumn';
import {DxCustomFilter} from "../../../additional_components/DxCustomFilter";
import {filterRowMessages} from "../../../additional_components/DxGridLocaleConfig";
import StudentUserDataModal from "../../../additional_components/ModalUserData/ModalUserData";
import ModalCreateNewModerator from "../../../additional_components/ModalCreateNewModerator/ModalCreateNewModerator";

function Moderators_list(props: any) {
    const [page, setPage] = useState<number>(0)
    const [pageSize, setPageSize] = useState<number>(6)

    const [rows, setRows] = useState<any>([])
    const [rowCount, setRowCount] = useState<number>(0)

    const [columns] = useState<Column[]>([
        {name: 'userId', title: 'ID пользователя'},
        {name: 'fio', title: 'ФИО'},
        {name: 'credentials', title: 'Данные для входа'},
        {name: 'delete', title: 'Действия'},
    ])
    const [columnsWidth] = useState<TableColumnWidthInfo[]>([
        {columnName: 'userId', width: 200},
        {columnName: 'fio', width: 300},
        {columnName: 'credentials', width: 160},
        {columnName: 'delete', width: 190},
    ])

    const [defaultHiddenColumnNames] = useState<string[]>([
        'credentials',
        'delete',
    ])
    const [currentHiddenColumnNames, setCurrentHiddenColumnNames] = useState<string[]>(defaultHiddenColumnNames)

    const [filters, setFilters] = useState<Filter[]>([])
    const [filtersNeedReset, setFiltersNeedReset] = useState<boolean>(false)
    const [filteringStateColumnExtensions] = useState([
        {columnName: 'credentials', filteringEnabled: false},
        {columnName: 'delete', filteringEnabled: false},
    ])

    const [sorting, setSorting] = useState<Sorting[]>([])
    const [sortingStateColumnExtensions] = useState([
        {columnName: 'credentials', sortingEnabled: false},
        {columnName: 'delete', sortingEnabled: false},
    ])

    const [loading, setLoading] = useState<boolean>(true)

    //обновить список студентов
    function updateList(): void {
        props.getModeratorsList(
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

    useEffect(() => {
        updateList()

        // console.log(page * pageSize,( page + 1) * pageSize);
    }, [page, sorting, filters])

    //обновить статус загрузки листа
    useEffect(() => {
        setLoading(props.Admin.moderatorsList.loading)
    }, [props.Admin.moderatorsList.loading])

    //обновить лист в компоненте
    useEffect(() => {
        setRows(props.Admin.moderatorsList.list)
        setRowCount(props.Admin.moderatorsList.count)

        //сброс страницы на 0 если лист маленький
        if (props.Admin.moderatorsList.count <= pageSize && filters?.length) {
            setPage(0)
            // console.log(props.Admin.studentsList.count, pageSize);
            // console.log(page);
        }

    }, [props.Admin.moderatorsList.list])

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

    //компаратор для специфичных колонок
    const Cell = React.memo((cellProps: any) => {
        const {column, row} = cellProps;

        if (column.name === 'credentials') {
            return (
                <Table.Cell {...cellProps}>
                    <StudentUserDataModal userId={row.userId}/>
                </Table.Cell>
            )
        }

        if (column.name === 'delete') {
            return (
                <Table.Cell {...cellProps}>
                    <Button color={'secondary'}
                            variant={'contained'}
                            onClick={() => {
                                let sure = window.confirm(`Вы уверены что хотите удалить администратора?`)

                                if (sure) {
                                    props.deleteModerator(row.userId, () => {
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
                            Список администраторов
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

                            <ModalCreateNewModerator updateList={() => {
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
        deleteModerator: (
            userId: number,
            cb?: Function | undefined,
        ) => {
            dispatch(deleteModerator(userId, cb))
        },
        getModeratorsList: (
            limit: string | number,
            offset: string | number,
            page: string | number,
            sort?: Sorting[],
            filters?: Filter[],
        ) => {
            dispatch(getModeratorsList(limit, offset, page, sort, filters))
        },
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(React.memo(Moderators_list)))