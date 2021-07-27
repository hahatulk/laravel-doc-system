import React, {useEffect, useState} from 'react'
import {connect} from "react-redux"
import {withRouter} from "react-router"
import {Loading} from '../Loading/Loading';
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography} from "@material-ui/core";
import {Grid as DxGrid, PagingPanel, Table, TableColumnResizing, TableHeaderRow} from "@devexpress/dx-react-grid-material-ui";
import {Column, CustomPaging, Filter, PagingState, Sorting, SortingState, TableColumnWidthInfo} from "@devexpress/dx-react-grid";
import {getLocalPlainDateTime} from "../Dates";
import axios, {AxiosResponse} from "axios";
import {SnackBarUtils} from "../SnackBarUtils/SnackBarUtils";
import fileDownload from 'js-file-download';
import PrepareOrder from "../ModalOrderPrepare/ModalOrderPrepareSpravkaObObucheni";
import ModalStudentData from "../ModalStudentData/ModalStudentData";
import {REACT_APP_ADMIN_DOWNLOAD, REACT_APP_ADMIN_ORDERS_UPDATE, REACT_APP_ORDERS} from "../Routes/Routes";

function ModalOrders(props: any) {
    const userId = props.userId

    const [open, setOpen] = useState<boolean>(false)

    const [page, setPage] = useState<number>(0)
    const [pageSize, setPageSize] = useState<number>(6)

    const [rows, setRows] = useState<any>([])
    const [rowCount, setRowCount] = useState<number>(0)

    const [columns] = useState<Column[]>([
        {name: 'id', title: 'Номер'},
        {name: 'title', title: 'Название'},
        {name: 'status', title: 'Статус'},
        {name: 'createdAt', title: 'Дата заказа'},
        {name: 'actions', title: 'Действия'},
        {name: 'download', title: 'Документ'},
        {name: 'userData', title: 'Инф. о студенте'},
    ])
    const [columnsWidth] = useState<TableColumnWidthInfo[]>([
        {columnName: 'id', width: 130},
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
    const [filteringStateColumnExtensions] = useState([
        {columnName: 'status', filteringEnabled: false},
        {columnName: 'userData', filteringEnabled: false},
    ])

    const [sorting, setSorting] = useState<Sorting[]>([])
    const [sortingStateColumnExtensions] = useState([
        {columnName: 'userData', sortingEnabled: false},
        // {columnName: 'documentRequestsList', sortingEnabled: false},
    ])

    const [orderListLoading, setOrderListLoading] = useState(true)

    function openDialog() {
        setOpen(true)
    }

    function closeDialog() {
        setOpen(false)
    }

    function updateList() {
        setOrderListLoading(true)
        axios.post(REACT_APP_ORDERS + ``,
            {
                userId: userId,
                limit: pageSize,
                offset: page * pageSize,
                sorting: sorting,
            })
            .then((res: AxiosResponse) => {
                setRows(res.data.data.orders)
                setRowCount(res.data.data.ordersCount)

                setOrderListLoading(false)
            })
            .catch(() => {
                SnackBarUtils.error('Ошибка загрузки данных студента')
                // setOpen(false)
            })
    }

    //получать новый лист при изменении параметров
    useEffect(() => {
        if (open) {
            updateList()
        }
    }, [open, page, pageSize, sorting])

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
                                        axios.get(REACT_APP_ADMIN_DOWNLOAD + `?orderId=${row.id}`,
                                            {
                                                responseType: 'arraybuffer'
                                            })
                                            .then((r: AxiosResponse) => {
                                                fileDownload(r.data, row.id);
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
                                if (!orderListLoading) {
                                    setOrderListLoading(true)
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
                                if (!orderListLoading) {
                                    setOrderListLoading(true)
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
                        Обработка
                    </Button>
                    <Button color={'primary'}
                            variant={'contained'}
                            onClick={async () => {
                                if (!orderListLoading) {
                                    setOrderListLoading(true)
                                    await axios.post(REACT_APP_ADMIN_ORDERS_UPDATE + ``,
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
                <DialogTitle id="form-dialog-title">
                    <div className={"table-description"}>
                        <Typography variant={'h6'}>
                            Заказы студента {props.studentName}
                        </Typography>
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
                </DialogTitle>
                <DialogContent>

                    <DxGrid
                        rows={rows}
                        columns={columns}
                    >
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
                        <TableHeaderRow
                            showSortingControls
                        />
                        <PagingPanel/>
                    </DxGrid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeDialog} color="primary">
                        Закрыть
                    </Button>
                </DialogActions>
                {orderListLoading && <Loading/>}
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
    return {}
}
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ModalOrders))
