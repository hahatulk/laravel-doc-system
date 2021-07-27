import React, {ReactComponentElement, useEffect} from "react";
import {Redirect} from "react-router";
import {tokenCheck} from "../../redux/actions/actionsAuth";
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";

export default function (ComposedComponent: any): any {
    function Authenticate(props: any) {
        // useEffect(() => {
        //     props.tokenCheck();
        //     // eslint-disable-next-line
        // },[]);
        return props.isAuthenticated ? <Redirect to={'/'}/> : ComposedComponent
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
    return connect(mapStateToProps, mapDispatchToProps)(withRouter(Authenticate));
}