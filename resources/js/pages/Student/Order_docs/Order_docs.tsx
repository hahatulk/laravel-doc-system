import React from 'react'
import {connect} from "react-redux"
import {withRouter} from "react-router"
import {Container, Grid,} from '@material-ui/core'
import HeaderBar from "../../../additional_components/HeaderBar/HeaderBar";
import './Order_docs.scss'
import {orderSpravkaObObuchenii} from "../../../redux/actions/actionsOrders";
import {userInfoGet} from "../../../redux/actions/actionsLk";
import {OrderCardSpravkaObObuchenii} from "./OrderCards";

function Order_docs(props: any) {



    return (
        <div>
            <HeaderBar/>
            <Container className={'Root-container'}>
                <Grid container spacing={3}>
                    <Grid item md={3} xs={12}>
                        <OrderCardSpravkaObObuchenii
                            {...props}
                            handleSubmit={(
                                count: number,
                                comment: string | undefined,
                                cb?: Function | undefined,
                            ) => {
                                props.orderSpravkaObObuchenii(count, comment, cb)
                            }}
                        />
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
        orderSpravkaObObuchenii: (count: number, comment: string | undefined, cb?: Function | undefined) => {
            dispatch(orderSpravkaObObuchenii(count, comment, cb));
        },
        userInfoGet: (cb?: Function) => {
            dispatch(userInfoGet(cb))
        },
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Order_docs))