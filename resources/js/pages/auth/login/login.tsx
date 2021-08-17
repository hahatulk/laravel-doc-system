import React, {useEffect} from 'react'
import {connect} from "react-redux"
import {withRouter} from "react-router"
import './login.scss'
import {Formik} from "formik";
import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField} from '@material-ui/core'
import {login} from "../../../redux/actions/actionsAuth";
import {SnackBarUtils} from "../../../additional_components/SnackBarUtils/SnackBarUtils";

function Login(props: any) {
    let isMounted = false

    useEffect(() => {
        isMounted = true
        return () => {
            isMounted = false
        }
    }, [])

    return (
        <div className={''}>

            <Dialog open={true}
                    aria-labelledby={'login-form'}
            >
                <DialogTitle id={'login-form'}>Вход в личный кабинет</DialogTitle>
                <DialogContent>
                    <DialogContentText>Система для заказа документов в учебной части.</DialogContentText>
                    <DialogContentText>Данные для входа можно узнать в учебной части</DialogContentText>

                    <Formik
                        initialValues={{
                            username: '',
                            password: ''
                        }}
                        validate={(values) => {
                            let errors: any = {}

                            if (!values.username) {
                                // console.log(values.username);
                            }
                            if (!values.password) {
                                //
                            }

                            return errors
                        }}
                        onSubmit={(values, actions) => {
                            if (!values.username || !values.password) {
                                SnackBarUtils.warning('Не введен логин или пароль', {
                                    anchorOrigin: {
                                        vertical: 'bottom',
                                        horizontal: 'center',
                                    }
                                })

                                actions.setSubmitting(false);

                            } else {
                                actions.setSubmitting(true);
                                const username = values.username
                                const password = values.password

                                props.login(username.trim().toLowerCase(), password, () => {
                                    if (isMounted) {
                                        actions.setSubmitting(false);
                                    }
                                })
                            }
                        }}
                    >
                        {fprops => (
                            <form onSubmit={fprops.handleSubmit}>
                                {fprops.errors.username && fprops.touched.username && <div>{fprops.errors.username}</div>}
                                <TextField margin={'dense'}
                                           label={'Логин'}
                                           type={'text'}
                                           fullWidth
                                           onChange={fprops.handleChange}
                                           onBlur={fprops.handleBlur}
                                           value={fprops.values.username}
                                           name="username"
                                />
                                <TextField margin={'dense'}
                                           label={'Пароль'}
                                           type={'password'}
                                           fullWidth
                                           onChange={fprops.handleChange}
                                           onBlur={fprops.handleBlur}
                                           value={fprops.values.password}
                                           name="password"
                                />
                                {/*{props.errors.username && <div id="feedback">{props.errors.username}</div>}*/}
                                <DialogActions>
                                    <Button type={'submit'} onClick={(e) => {
                                        if (fprops.isSubmitting) {
                                            e.preventDefault()
                                        }
                                    }}>
                                        Войти
                                    </Button>
                                </DialogActions>
                            </form>
                        )}
                    </Formik>
                </DialogContent>
            </Dialog>


        </div>
    )
}

const mapStateToProps = (state: any) => {
    return {
        isAuthenticated: state.Auth.isAuthenticated
    }
}
const mapDispatchToProps = (dispatch: any) => {
    return {
        login: (username: string, password: string, cb: Function) => {
            dispatch(login(username, password, cb));
        },
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Login))


