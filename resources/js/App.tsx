import React, {Fragment, useEffect} from 'react'
import {withRouter} from "react-router-dom"
import "./App.scss"
import "./themes.scss"
import AppRouter from "./AppRouter";
import {tokenCheck} from "./redux/actions/actionsAuth";
import {connect} from "react-redux";
import {LoadingBar} from 'react-redux-loading-bar'

function App(props: any) {
    //самый первый чек токена, определяет отрисуется ли приложение
    //(если бек молчит, приложение будет мертво)
    useEffect(() => {
        props.tokenCheck();
        // eslint-disable-next-line
    }, []);

    return (
        <Fragment>
            <LoadingBar/>
                {props.isAuthenticated !== ""
                    ? (
                        <AppRouter {...props}/>
                    )
                    : ''
                }
        </Fragment>

    )
}

const mapStateToProps = (state: any) => {
    return {
        isAuthenticated: state.Auth.isAuthenticated,
    }
};
const mapDispatchToProps = (dispatch: any) => {
    return {
        tokenCheck: () => {
            dispatch(tokenCheck());
        },
    }
};
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(App));
