import React, {useCallback, useEffect, useState} from 'react'
import {connect} from "react-redux"
import {withRouter} from "react-router"
import {getArchivedOrdersList} from "../../../redux/actions/actionsOrders";
import {editStudent} from "../../../redux/actions/actionsAdmin";
import Paper from '@material-ui/core/Paper';
import {Column, CustomPaging, Filter, FilteringState, PagingState, Sorting, SortingState, TableColumnWidthInfo,} from '@devexpress/dx-react-grid';
import {ColumnChooser, Grid as DxGrid, PagingPanel, Table, TableColumnResizing, TableColumnVisibility, TableFilterRow, TableHeaderRow, Toolbar,} from '@devexpress/dx-react-grid-material-ui';
import {Loading} from '../../../additional_components/Loading/Loading';
import HeaderBar from '../../../additional_components/HeaderBar/HeaderBar';
import {Button, Container, Typography} from "@material-ui/core";
import './Archived_Orders_list.scss'
import {getLocalPlainDateTime} from "../../../additional_components/Dates";
import _ from "lodash";
import PrepareOrder from "../../../additional_components/ModalOrderPrepare/ModalOrderPrepareSpravkaObObucheni";
import axios, {AxiosResponse} from "axios";
import fileDownload from "js-file-download";
import {SnackBarUtils} from "../../../additional_components/SnackBarUtils/SnackBarUtils";
import ModalStudentData from "../../../additional_components/ModalStudentData/ModalStudentData";
import {DxCustomFilter} from "../../../additional_components/DxCustomFilter";
import {filterRowMessages} from "../../../additional_components/DxGridLocaleConfig";

function Archived_Orders_list(props: any) {
    const [page, setPage] = useState<number>(0)
    const [pageSize, setPageSize] = useState<number>(6)

    const [rows, setRows] = useState<any>([])
    const [rowCount, setRowCount] = useState<number>(0)

    const [columns] = useState<Column[]>([
        {name: 'id', title: 'Номер'},
        {name: 'title', title: 'Название'},
        {name: 'status', title: 'Статус'},
        {name: 'createdAt', title: 'Дата заказа'},
        {name: 'fullFilledAt', title: 'Дата завершения'},
        {name: 'actions', title: 'Действия'},
        {name: 'download', title: 'Документ'},
        {name: 'userData', title: 'Инф. о студенте'},
    ])
    const [columnsWidth] = useState<TableColumnWidthInfo[]>([
        {columnName: 'id', width: 130},
        {columnName: 'title', width: 220},
        {columnName: 'status', width: 120},
        {columnName: 'createdAt', width: 160},
        {columnName: 'fullFilledAt', width: 160},
        {columnName: 'userData', width: 160},
        {columnName: 'actions', width: 320},
        {columnName: 'download', width: 220},
    ])
    const [defaultHiddenColumnNames] = useState<string[]>([
        'userId',
        'surname',
        'name',
        'patronymic',
        'formaObuch',
    ])

    const [filtersNeedReset, setFiltersNeedReset] = useState<boolean>(false)
    const [filteringStateColumnExtensions] = useState([
        {columnName: 'status', filteringEnabled: false},
        {columnName: 'userData', filteringEnabled: false},
    ])

    const [sortingStateColumnExtensions] = useState([
        {columnName: 'userData', sortingEnabled: false},
        // {columnName: 'documentRequestsList', sortingEnabled: false},
    ])

    const [filters, setFilters] = useState<Filter[]>([])
    const [sorting, setSorting] = useState<Sorting[]>([])

    const [loading, setLoading] = useState<boolean>(true)

    //обновить список студентов
    function updateList(): void {
        props.getArchivedOrdersList(
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
        //todo сделать задержку перед поиском
        updateList()
        // console.log(page * pageSize,( page + 1) * pageSize);
    }, [page, sorting, filters])

    //обновить статус загрузки листа
    useEffect(() => {
        setLoading(props.Admin.archivedOrdersList.loading)
    }, [props.Admin.archivedOrdersList.loading])

    //обновить лист в компоненте
    useEffect(() => {
        setRows(props.Admin.archivedOrdersList.list)
        setRowCount(props.Admin.archivedOrdersList.count)

        //сброс страницы на 0 если лист маленький
        if (props.Admin.archivedOrdersList.count <= pageSize && filters?.length) {
            setPage(0)
            // console.log(props.Admin.studentsList.count, pageSize);
            // console.log(page);
        }

    }, [props.Admin.archivedOrdersList.list])

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

        if (column.name === 'status') {
            return (
                <Table.Cell {...cellProps}>
                    <span>{
                        row.status === 0
                            ? 'Готово'
                            : row.status === 1 ? 'В обработке' : row.status === -1 ? 'Отклонено' : 'Ошибка'}</span>
                </Table.Cell>
            )
        }

        if (column.name === 'createdAt') {
            return (
                <Table.Cell {...cellProps}>
                    <span>
                        {getLocalPlainDateTime(row.createdAt)}
                    </span>
                </Table.Cell>
            )
        }

        if (column.name === 'fullFilledAt') {
            return (
                <Table.Cell {...cellProps}>
                    <span>
                        {getLocalPlainDateTime(row.fullFilledAt)}
                    </span>
                </Table.Cell>
            )
        }

        if (column.name === 'download') {
            return (
                <Table.Cell {...cellProps}>

                    <PrepareOrder updateList={updateList} row={row}/>
                    {row.documentPath && row.fullFilled
                        ? (
                            <Button color={'default'}
                                    variant={'contained'}
                                    onClick={() => {
                                        // setIsSubmitting(true)
                                        axios.get(process.env.REACT_APP_ADMIN_DOWNLOAD + `?orderId=${row.id}`,
                                            {
                                                responseType: 'arraybuffer'
                                            })
                                            .then((r: AxiosResponse) => {
                                                fileDownload(r.data, row.documentPath);
                                            })
                                            .catch(() => {
                                                SnackBarUtils.error('Ошибка получения данных')
                                            })
                                            .finally(() => {
                                                // setIsSubmitting(false)
                                            })
                                    }}
                            >
                                Скачать
                            </Button>
                        )
                        : ''}

                </Table.Cell>
            )
        }

        if (column.name === 'actions') {
            return (
                <Table.Cell {...cellProps}>
                    <Button color={'secondary'}
                            variant={'contained'}
                            onClick={async () => {
                                if (!loading) {
                                    setLoading(true)
                                    await axios.post(process.env.REACT_APP_ADMIN_ORDERS_UPDATE + ``,
                                        {
                                            orderId: row.id,
                                            status: -1,
                                        }, {
                                            responseType: 'arraybuffer'
                                        })
                                        .then((r: AxiosResponse) => {

                                        })
                                        .catch(() => {
                                            SnackBarUtils.error('Ошибка')
                                        })
                                        .finally(() => {
                                            updateList()
                                        })
                                }
                            }}
                            disabled={row.status === -1}
                    >
                        Отказ
                    </Button>
                    <Button color={'default'}
                            variant={'contained'}
                            onClick={async () => {
                                if (!loading) {
                                    setLoading(true)
                                    await axios.post(process.env.REACT_APP_ADMIN_ORDERS_UPDATE + ``,
                                        {
                                            orderId: row.id,
                                            status: 1,
                                        }, {
                                            responseType: 'arraybuffer'
                                        })
                                        .then((r: AxiosResponse) => {

                                        })
                                        .catch(() => {
                                            SnackBarUtils.error('Ошибка')
                                        })
                                        .finally(() => {
                                            updateList()
                                        })
                                }
                            }}
                            disabled={row.status === 1}
                    >
                        Обработка
                    </Button>
                    <Button color={'primary'}
                            variant={'contained'}
                            onClick={async () => {
                                if (!loading) {
                                    setLoading(true)
                                    await axios.post(process.env.REACT_APP_ADMIN_ORDERS_UPDATE + ``,
                                        {
                                            orderId: row.id,
                                            status: 0,
                                        }, {
                                            responseType: 'arraybuffer'
                                        })
                                        .then((r: AxiosResponse) => {

                                        })
                                        .catch(() => {
                                            SnackBarUtils.error('Ошибка')
                                        })
                                        .finally(() => {
                                            updateList()
                                        })
                                }
                            }}
                            disabled={row.status === 0}
                    >
                        Принять
                    </Button>
                </Table.Cell>
            )
        }

        if (column.name === 'userData') {
            return (
                <Table.Cell {...cellProps}>
                    <ModalStudentData userId={row.userId}/>
                </Table.Cell>
            )
        }

        return <Table.Cell {...cellProps} />;
    })

    return (
        <div className={'Archived_Orders_list'}>
            <HeaderBar/>

            <Container className={'Root-container'}>
                <Paper className={'Archived_Orders_list_table'} style={{position: 'relative', minHeight: '459px'}}>
                    <div className={"table-description"}>
                        <Typography variant={'h6'} className={'table-title'}>
                            Список заказов (архив)
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
        editStudent: (userId: number, values: any, cb: Function) => {
            dispatch(editStudent(userId, values, cb))
        },
        getArchivedOrdersList: (
            limit: string | number,
            offset: string | number,
            page: string | number,
            sort?: Sorting[],
            filters?: Filter[],
        ) => {
            dispatch(getArchivedOrdersList(limit, offset, page, sort, filters))
        },
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Archived_Orders_list))
