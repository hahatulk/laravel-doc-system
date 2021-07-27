import React from "react";
import {connect} from "react-redux";
import {Link, withRouter} from "react-router-dom";
import {logout, tokenCheck} from "../../redux/actions/actionsAuth";
import {AxiosResponse} from "axios";

function ProtectedLink({component: Component, ...props}: any) {
    //chooses function to run as callback after authcheck
    function action(res: AxiosResponse) {
        switch (props.action) {
            case 'logout':
                return logout();
            case 'noAuth':
                return noAuth();
            default:
                return requiredAuth(res);
        }
    }

    //routes for authed users
    function requiredAuth(res: any) {
        if (res.status === 200) {
            props.history.push(props.to);
        } else {
            // props.notification('warning', 'Для доступа к этой функции требуется авторизация');
            props.history.push('/login')
        }
    }

    // do not let enter if user is authed
    function alreadyAuthed(response: any) {
        if (response.status === 200) {
            props.history.push('/');
        } else {
            props.history.push(props.to);
        }
    }

    function logout() {
        props.logout((res: AxiosResponse) => {
            callback(res)
        });
        if (!!props.to) {
            props.history.push(props.to)
        }


    }

    function callback(res: AxiosResponse) {
        if (!!props.onClick) {
            props.onClick(res);
        } else {
            return false
        }
    }

    //no auth needed for route
    function noAuth() {
        // props.tokenCheck();
        props.history.push(props.to)
    }

    return (
        <Link to={props.to ? props.to : ''}
              className={props.className ? 'ProtectedLink ' + props.className : 'ProtectedLink'}
              onClick={e => {
                  e.preventDefault();

                  props.tokenCheck((res: AxiosResponse) => {
                      action(res)
                  });


              }}
        >
            {props.children}
        </Link>
    )
}

const mapStateToProps = (state: any) => {
    return {
        isAuthenticated: state.Auth.isAuthenticated
    }
};
const mapDispatchToProps = (dispatch: any) => {
    return {
        tokenCheck: (cb: Function) => {
            dispatch(tokenCheck(cb));
        },
        logout: (cb: Function) => {
            dispatch(logout(cb));
        }
    }
};
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ProtectedLink));
