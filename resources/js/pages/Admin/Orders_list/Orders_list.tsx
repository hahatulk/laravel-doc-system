import React, {useCallback, useEffect, useState} from 'react'
import {connect} from "react-redux"
import {withRouter} from "react-router"
import {getArchivedOrdersList, getOrdersList} from "../../../redux/actions/actionsOrders";
import {editStudent} from "../../../redux/actions/actionsAdmin";
import Paper from '@material-ui/core/Paper';
import {Column, CustomPaging, Filter, FilteringState, PagingState, Sorting, SortingState, TableColumnWidthInfo,} from '@devexpress/dx-react-grid';
import {ColumnChooser, Grid as DxGrid, PagingPanel, Table, TableColumnResizing, TableColumnVisibility, TableFilterRow, TableHeaderRow, Toolbar,} from '@devexpress/dx-react-grid-material-ui';
import {Loading} from '../../../additional_components/Loading/Loading';
import HeaderBar from '../../../additional_components/HeaderBar/HeaderBar';
import {Button, Container, Typography} from "@material-ui/core";
import './Orders_list.scss'
import Link from "../../../additional_components/HOC/ProtectedLink";
import {getLocalPlainDateTime} from "../../../additional_components/Dates";
import _ from "lodash";
import axios, {AxiosResponse} from "axios";
import fileDownload from "js-file-download";
import {SnackBarUtils} from "../../../additional_components/SnackBarUtils/SnackBarUtils";
import PrepareOrder from "../../../additional_components/Modal/ModalOrderPrepare/ModalOrderPrepareSpravkaObObucheni";
import ModalStudentData from '../../../additional_components/Modal/ModalStudentData/ModalStudentData';
import ModalOrderComment from "../../../additional_components/Modal/ModalOrderComment/ModalOrderComment";
import {DxCustomFilter} from "../../../additional_components/DxCustomFilter";
import {filterRowMessages} from "../../../additional_components/DxGridLocaleConfig";
import {REACT_APP_ADMIN_DOWNLOAD, REACT_APP_ADMIN_ORDERS_UPDATE} from "../../../additional_components/Routes";

function Orders_list(props: any) {
    const [page, setPage] = useState<number>(0)
    const [pageSize, setPageSize] = useState<number>(6)

    const [rows, setRows] = useState<any>([])
    const [rowCount, setRowCount] = useState<number>(0)

    const [columns] = useState<Column[]>([
        {name: 'id', title: 'Номер'},
        {name: 'title', title: 'Название'},
        {name: 'comment', title: 'Примечание'},
        {name: 'status', title: 'Статус'},
        {name: 'createdAt', title: 'Дата заказа'},
        {name: 'actions', title: 'Действия'},
        {name: 'download', title: 'Документ'},
        {name: 'userData', title: 'Инф. о студенте'},
    ])
    const [columnsWidth] = useState<TableColumnWidthInfo[]>([
        {columnName: 'id', width: 110},
        {columnName: 'comment', width: 135},
        {columnName: 'title', width: 220},
        {columnName: 'status', width: 120},
        {columnName: 'createdAt', width: 160},
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

    const [filters, setFilters] = useState<Filter[]>([])
    const [filtersNeedReset, setFiltersNeedReset] = useState<boolean>(false)
    const [filteringStateColumnExtensions] = useState([
        {columnName: 'status', filteringEnabled: false},
        {columnName: 'userData', filteringEnabled: false},
        {columnName: 'comment', filteringEnabled: false},
        {columnName: 'actions', filteringEnabled: false},
        {columnName: 'download', filteringEnabled: false},
    ])

    const [sorting, setSorting] = useState<Sorting[]>([])
    const [sortingStateColumnExtensions] = useState([
        {columnName: 'userData', sortingEnabled: false},
        {columnName: 'comment', sortingEnabled: false},
        {columnName: 'actions', sortingEnabled: false},
        {columnName: 'download', sortingEnabled: false},
    ])

    const [loading, setLoading] = useState<boolean>(true)

    //обновить список студентов
    function updateList(): void {
        props.getOrdersList(
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
        setLoading(props.Admin.ordersList.loading)
    }, [props.Admin.ordersList.loading])

    //обновить лист в компоненте
    useEffect(() => {
        setRows(props.Admin.ordersList.list)
        setRowCount(props.Admin.ordersList.count)

        //сброс страницы на 0 если лист маленький
        if (props.Admin.ordersList.count <= pageSize && filters?.length) {
            setPage(0)
            // console.log(props.Admin.studentsList.count, pageSize);
            // console.log(page);
        }

    }, [props.Admin.ordersList.list])

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
                        row.status === 1
                            ? 'Готово'
                            : row.status === 0 ? 'В обработке' : row.status === -1 ? 'Отклонено' : 'Ошибка'}</span>
                </Table.Cell>
            )
        }

        if (column.name === 'comment' && row.comment) {
            return (
                <Table.Cell {...cellProps}>
                    <ModalOrderComment comment={row.comment.toString()}/>
                </Table.Cell>
            )
        }

        if (column.name === 'createdAt') {
            return (
                <Table.Cell {...cellProps}>
                    <span>
                        {row.createdAt}
                    </span>
                </Table.Cell>
            )
        }

        if (column.name === 'download') {
            return (
                <Table.Cell {...cellProps}>

                    <PrepareOrder updateList={updateList} row={row}/>
                    {row.fullFilled
                        ? (
                            <Button color={'default'}
                                    variant={'contained'}
                                    onClick={() => {
                                        // setIsSubmitting(true)
                                        axios.get(REACT_APP_ADMIN_DOWNLOAD + `?orderId=${row.id}`,
                                            {
                                                responseType: 'blob'
                                            })
                                            .then((r: AxiosResponse) => {
                                                fileDownload(r.data, `Заказ №${row.id} ${row.student.groups.name}  ${row.student.surname} ${row.student.name} ${row.student.patronymic}.docx`);
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
                                    await axios.post(REACT_APP_ADMIN_ORDERS_UPDATE + ``,
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
                                    await axios.post(REACT_APP_ADMIN_ORDERS_UPDATE + ``,
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
                            disabled={row.status === 0}
                    >
                        Обработка
                    </Button>
                    <Button color={'primary'}
                            variant={'contained'}
                            onClick={async () => {
                                if (!loading) {
                                    setLoading(true)
                                    await axios.post(REACT_APP_ADMIN_ORDERS_UPDATE + ``,
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
        <div className={'Orders_list'}>
            <HeaderBar/>

            <Container className={'Root-container'}>
                <Paper className={'Orders_list_table'} style={{position: 'relative', minHeight: '459px'}}>
                    <div className={"table-description"}>
                        <Typography variant={'h6'} className={'table-title'}>
                            Список заказов
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
                            <Link to={'/orders/archived'}>

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
                        // getRowId={getRowId}
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
        getOrdersList: (
            page: string | number,
            sort?: Sorting[],
            filters?: Filter[],
        ) => {
            dispatch(getOrdersList( page, sort, filters))
        },
        getArchivedOrdersList: (
            page: string | number,
            sort?: Sorting[],
            filters?: Filter[],
        ) => {
            dispatch(getArchivedOrdersList( page, sort, filters))
        },
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Orders_list))
