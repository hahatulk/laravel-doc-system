import React, {Fragment, useEffect} from 'react'
import {Switch, withRouter} from "react-router-dom"
import {Route} from 'react-router'
import "./App.scss"
import "./themes.scss"
import 'animate.css/animate.min.css';
// @ts-ignore
import Login from "./pages/auth/login/login";
import Lk from "./pages/lk/lk";
import requireAuth from "./additional_components/HOC/requireAuth";
import alreadyAuthed from "./additional_components/HOC/alreadyAuthed";
import {connect} from "react-redux";
import Order_docs from "./pages/Student/Order_docs/Order_docs";
import {userInfoGet} from "./redux/actions/actionsLk";
import Students_list from "./pages/Admin/Students_list/Students_list";
import Archived_Students_list from "./pages/Admin/Archived_Students_list/Archived_Students_list";
import Orders_list from "./pages/Admin/Orders_list/Orders_list";
import Archived_Orders_list from "./pages/Admin/Archived_Orders_list/Archived_Orders_list";
import Groups from "./pages/Admin/Groups/Groups";
import Prikaz_list from "./pages/Admin/Prikaz_list/Prikaz_list";
import Moderators_list from "./pages/Admin/Moderator_list/Moderators_list";

function AppRouter(props: any) {

    useEffect(() => {
        props.userInfoGet()
    }, [])

    return (
        <Fragment>
            <Switch>


                <Route exact path='/' component={
                    requireAuth(<Lk {...props}/>)
                }/>

                {
                    props.role === 'student'
                        ? (
                            <>
                                <Route exact path='/order' component={
                                    requireAuth(<Order_docs {...props}/>)
                                }/>
                            </>
                        )
                        : ''
                }

                {
                    props.role === 'admin'
                        ? (
                            <>
                                <Route exact path='/students' component={
                                    requireAuth(<Students_list {...props}/>)
                                }/>

                                <Route exact path='/students/archived' component={
                                    requireAuth(<Archived_Students_list {...props}/>)
                                }/>

                                <Route exact path='/orders' component={
                                    requireAuth(<Orders_list {...props}/>)
                                }/>

                                <Route exact path='/orders/archived' component={
                                    requireAuth(<Archived_Orders_list {...props}/>)
                                }/>

                                <Route exact path='/groups' component={
                                    requireAuth(<Groups {...props}/>)
                                }/>

                                <Route exact path='/prikaz_list' component={
                                    requireAuth(<Prikaz_list {...props}/>)
                                }/>

                                <Route exact path='/moderators' component={
                                    requireAuth(<Moderators_list {...props}/>)
                                }/>
                            </>
                        )
                        : ''
                }

                <Route exact path='/login' component={
                    alreadyAuthed(<Login {...props}/>)
                }/>


            </Switch>
        </Fragment>

    )
}

const mapStateToProps = (state: any) => {
    return {
        isAuthenticated: state.Auth.isAuthenticated,
        role: state.User.role,
    }
}
const mapDispatchToProps = (dispatch: any) => {
    return {
        userInfoGet: (cb?: Function) => {
            dispatch(userInfoGet(cb))
        },
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(AppRouter))
