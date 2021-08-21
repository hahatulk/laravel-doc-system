import React, {useEffect, useState} from 'react'
import {connect} from "react-redux"
import {withRouter} from "react-router"
import './lk.scss'
import {Button, Container, Grid, Paper, Typography} from '@material-ui/core'
import {ordersGet, userInfoGet} from "../../redux/actions/actionsLk";
import {getLocalDate, getLocalPlainDateTime} from '../../additional_components/Dates';
import HeaderBar from "../../additional_components/HeaderBar/HeaderBar";
import {cancelOrder} from "../../redux/actions/actionsOrders";
import {Column, CustomPaging, PagingState, Sorting, SortingState, TableColumnWidthInfo} from "@devexpress/dx-react-grid";
import {Grid as DxGrid, PagingPanel, Table, TableColumnResizing, TableHeaderRow} from "@devexpress/dx-react-grid-material-ui";
import {Loading} from "../../additional_components/Loading/Loading";
import ModalOrderComment from "../../additional_components/Modal/ModalOrderComment/ModalOrderComment";

function Lk(props: any) {
    let _isMounted = false

    const [userInfoLoading, setUserInfoLoading] = useState(true)
    const [orderListLoading, setOrderListLoading] = useState(true)

    const [rows, setRows] = useState<any[]>([])
    const [rowCount, setRowCount] = useState<number>(0)

    const [columns] = useState<Column[]>([
        {name: 'id', title: 'Номер'},
        {name: 'title', title: 'Документ'},
        {name: 'status', title: 'Статус'},
        {name: 'createdAt', title: 'Дата заказа'},
        {name: 'comment', title: 'Комментарий'},
        {name: 'actions', title: 'Действия'},
    ])
    const [columnsWidth] = useState<TableColumnWidthInfo[]>([
        {columnName: 'id', width: 120},
        {columnName: 'title', width: 200},
        {columnName: 'status', width: 140},
        {columnName: 'createdAt', width: 180},
        {columnName: 'comment', width: 135},
        {columnName: 'actions', width: 160},
    ])

    const [sorting, setSorting] = useState<Sorting[]>([])
    const [sortingStateColumnExtensions] = useState([
        {columnName: 'actions', sortingEnabled: false},
    ])

    const [page, setPage] = useState<number>(0)
    const [pageSize, setPageSize] = useState<number>(6)

    function updateUserInfo() {
        props.userInfoGet(() => {
            if (_isMounted) {
                setUserInfoLoading(false)
            }
        })
    }

    function updateOrderList() {
        setOrderListLoading(true)
        if (props.User.role === 'admin') {
            props.ordersGet(
                -1,
                [],
                () => {
                    setOrderListLoading(false)
                }
            )
        } else if (props.User.role === 'student') {
            props.ordersGet(
                page,
                sorting,
                () => {
                    setOrderListLoading(false)
                }
            )
        }
    }

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

    // console.log(page * pageSize,( page + 1) * pageSize);

    useEffect(() => {
        _isMounted = true

        setUserInfoLoading(true)
        setOrderListLoading(true)
        updateUserInfo()

        return () => {
            _isMounted = false
        }
    }, [])

    //обновление заказа при листании и init
    useEffect(() => {
        if (props.User.role && _isMounted) {
            updateOrderList()
        }
    }, [props.User.role, page, pageSize, sorting])

    useEffect(() => {
        setRows(props.User.orders.orders)
        setRowCount(props.User.orders.ordersCount)
    }, [props.User.orders.orders])

    const handleCancelOrder = (orderId: any) => {
        props.cancelSpravkaObObuchenii(orderId, () => {
            updateOrderList()
        })
    }

    const Cell = React.memo((cellProps: any) => {
        const {column, row} = cellProps;

        if (column.name === 'createdAt') {
            return (
                <Table.Cell {...cellProps}>
                    <span>
                        {row.createdAt}
                    </span>
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

        if (column.name === 'actions') {
            if (row.status === 0) {
                return (
                    <Table.Cell {...cellProps}>
                        <Button color={'secondary'}
                                variant={'contained'}
                                onClick={() => {
                                    setOrderListLoading(true)
                                    handleCancelOrder(row.id)
                                }}
                        >
                            Отмена
                        </Button>
                    </Table.Cell>
                )
            }
        }

        return <Table.Cell {...cellProps} />;
    })

    return (
        <div>
            <HeaderBar/>

            <Container className={'Root-container'}>
                <Grid container spacing={3}>
                    <Grid item md={4} xs={12}>
                        <Paper elevation={3} className={'PaperRelative'}>
                            <div className={'StudentInfo'}>

                                {
                                    props.User.name
                                        ? (
                                            <Typography variant={'body1'}>
                                                ФИО: {props.User.surname} {props.User.name} {props.User.patronymic}
                                            </Typography>
                                        )
                                        : ''
                                }


                                {
                                    props.User.gender
                                        ? (
                                            <Typography variant={'body1'}>
                                                Пол: {props.User.gender}
                                            </Typography>
                                        )
                                        : ''
                                }


                                {
                                    props.User.birthday
                                        ? (
                                            <Typography variant={'body1'}>
                                                Дата рождения: {getLocalDate(props.User.birthday)}
                                            </Typography>
                                        )
                                        : ''
                                }


                                {
                                    props.User.formaObuch !== ''
                                        ? props.User.formaObuch === 0
                                        ? (
                                            <Typography variant={'body1'}>
                                                Форма обучения: бюджетная
                                            </Typography>
                                        )
                                        : (
                                            <Typography variant={'body1'}>
                                                Форма обучения: платная
                                            </Typography>
                                        )
                                        : ''
                                }

                                {
                                    props.User.groupName
                                        ? (
                                            <Typography variant={'body1'}>
                                                Группа: {props.User.groupName}
                                            </Typography>
                                        )
                                        : ''
                                }

                                {
                                    props.User.role
                                        ? (
                                            <Typography variant={'body1'}>
                                                Статус: {props.User.role === 'admin' ? 'Администратор' : 'Студент'}
                                            </Typography>
                                        )
                                        : ''
                                }

                            </div>
                            {userInfoLoading && <Loading/>}
                        </Paper>
                    </Grid>
                    <Grid item md={8} xs={12}>
                        <Paper elevation={3} className={'PaperRelative'}>
                            {
                                props.User.role === 'student'
                                    ? (
                                        <>
                                            <div className={"table-description"}>
                                                <Typography variant={'h6'}>
                                                    Список заказов
                                                </Typography>
                                                <Button color={'primary'}
                                                        variant={'contained'}
                                                        onClick={() => {
                                                            setOrderListLoading(true)
                                                            updateOrderList()
                                                        }}
                                                >
                                                    Обновить
                                                </Button>
                                            </div>
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
                                        </>
                                    )
                                    : ''
                            }
                            {
                                props.User.role === 'admin'
                                    ? (
                                        <>

                                            <div className={'ZakazInfo'}>
                                                <div className={"table-description"}>
                                                    <Typography variant={'h6'}>
                                                        Сведения о заказах
                                                    </Typography>
                                                    <Button color={'primary'}
                                                            variant={'contained'}
                                                            onClick={() => {
                                                                setOrderListLoading(true)
                                                                updateOrderList()
                                                            }}
                                                    >
                                                        Обновить
                                                    </Button>
                                                </div>
                                                <div className={'ZakazTable'}>
                                                    <Container className={'admin-zakaz-info'}>
                                                        <Typography variant={'body1'} className={'zakaz-info-item'}>
                                                            В обработке: {
                                                            rows?.length
                                                                ? rows[0].pending !== null ? rows[0].pending : 0
                                                                : 'Загрузка...'
                                                        }
                                                        </Typography>
                                                        <Typography variant={'body1'} className={'zakaz-info-item'}>
                                                            Завершенных: {
                                                            rows?.length
                                                                ? rows[0].successful !== null ? rows[0].successful : 0
                                                                : 'Загрузка...'
                                                        }
                                                        </Typography>
                                                        <Typography variant={'body1'} className={'zakaz-info-item'}>
                                                            Отклоненных: {
                                                            rows?.length
                                                                ? rows[0].canceled !== null ? rows[0].canceled : 0
                                                                : 'Загрузка...'
                                                        }
                                                        </Typography>
                                                        <Typography variant={'body1'} className={'zakaz-info-item'}>
                                                            Всего заказов: {
                                                            rows?.length
                                                                ? rows[0].total
                                                                : 'Загрузка...'
                                                        }
                                                        </Typography>
                                                    </Container>
                                                </div>
                                            </div>
                                        </>
                                    )
                                    : ''
                            }
                            {orderListLoading && <Loading/>}
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </div>
    )
}

const mapStateToProps = (state: any) => {
    return {
        Auth: state.Auth,
        User: state.User
    }
}
const mapDispatchToProps = (dispatch: any) => {
    return {
        userInfoGet: (cb?: Function) => {
            dispatch(userInfoGet(cb))
        },
        ordersGet: ( page: number, sorting: Sorting[], cb?: Function) => {
            dispatch(ordersGet( page, sorting, cb))
        },
        cancelSpravkaObObuchenii: (orderId: string | number, cb?: Function) => {
            dispatch(cancelOrder(orderId, cb))
        },
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Lk))

