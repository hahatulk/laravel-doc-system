import React, {Ref} from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import {Provider} from "react-redux";
import {store} from "./redux/store/store";
import {BrowserRouter} from "react-router-dom";
import {SnackbarProvider} from 'notistack';
import {Button} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import {SnackbarUtilsConfigurator} from './additional_components/SnackBarUtils/SnackBarUtils';

import 'date-fns';
import {MuiPickersUtilsProvider,} from '@material-ui/pickers';
import {localeMap, localeUtilsMap} from "./additional_components/DateLocaliser/DateLocaliser";

const notistackRef: Ref<any> = React.createRef();
const onClickDismiss = (key: any) => () => {
    notistackRef.current.closeSnackbar(key);
}
console.log('cihmb a')
ReactDOM.render(
    <Provider store={store}>
        <BrowserRouter>
            <SnackbarProvider
                // preventDuplicate
                ref={notistackRef}
                action={(key) => (
                    <Button color={'inherit'}
                            className={'dismiss-button'}
                            onClick={onClickDismiss(key)}
                    >
                        <CloseIcon/>
                    </Button>
                )}
            >
                <SnackbarUtilsConfigurator/>

                <MuiPickersUtilsProvider utils={localeUtilsMap['ru']} locale={localeMap['ru']}>
                    <App/>
                </MuiPickersUtilsProvider>

            </SnackbarProvider>
        </BrowserRouter>
    </Provider>
    , document.getElementById('root')
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
