import React, {useEffect} from "react";
import {withRouter} from "react-router-dom";
import {connect} from "react-redux";
import {tokenCheck} from "../../redux/actions/actionsAuth";

export default function (ComposedComponent: any): any {
    function Guest(props: any) {
        // useEffect(() => {
        //     // props.tokenCheck(() => {
        //     //     console.log(props.isAuthenticated)
        //     // });
        //
        //
        //     // eslint-disable-next-line
        // }, []);

        return ComposedComponent;
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
    return connect(mapStateToProps, mapDispatchToProps)(withRouter(Guest));
}
