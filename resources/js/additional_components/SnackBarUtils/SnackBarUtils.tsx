import {OptionsObject, useSnackbar, WithSnackbarProps} from 'notistack'
import * as React from 'react'

interface IProps {
    setUseSnackbarRef: (showSnackbar: WithSnackbarProps) => void
}

const InnerSnackbarUtilsConfigurator: React.FC<IProps> = (props: IProps) => {
    props.setUseSnackbarRef(useSnackbar())
    return null
}

let useSnackbarRef: WithSnackbarProps
const setUseSnackbarRef = (useSnackbarRefProp: WithSnackbarProps) => {
    useSnackbarRef = useSnackbarRefProp
}

export const SnackbarUtilsConfigurator = () => {
    return (
        <InnerSnackbarUtilsConfigurator setUseSnackbarRef={setUseSnackbarRef}/>
    )
}

export const SnackBarUtils = {
    success(msg: string, options: OptionsObject = {}) {
        this.toast(msg, {variant: 'success', autoHideDuration: 5000, ...options})
    },
    warning(msg: string, options: OptionsObject = {}) {
        this.toast(msg, {variant: 'warning', autoHideDuration: 5000, ...options})
    },
    info(msg: string, options: OptionsObject = {}) {
        this.toast(msg, {variant: 'info', autoHideDuration: 5000, ...options})
    },
    error(msg: string, options: OptionsObject = {}) {
        this.toast(msg, {variant: 'error', autoHideDuration: 5000, ...options})
    },
    toast(msg: string, options: OptionsObject = {}) {
        useSnackbarRef.enqueueSnackbar(msg, options)
    }
}
