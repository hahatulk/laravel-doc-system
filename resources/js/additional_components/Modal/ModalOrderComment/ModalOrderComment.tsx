import React, {useState} from 'react'
import {connect} from "react-redux"
import {withRouter} from "react-router"
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography} from "@material-ui/core";

function ModalOrderComment(props: any) {
    const [open, setOpen] = useState(false);

    function openDialog() {
        setOpen(true)
    }

    function closeDialog() {
        setOpen(false)
    }

    return (
        <>
            <Button color={'primary'}
                    variant={'contained'}
                    onClick={() => {
                        openDialog()
                    }}
            >
                Показать
            </Button>
            <Dialog
                open={open}
                maxWidth={'sm'}
                fullWidth={true}
                onClose={closeDialog}
                aria-labelledby="form-dialog-title"
            >
                <DialogTitle id="form-dialog-title">Комментарий к заказу</DialogTitle>
                <DialogContent>
                    <Typography variant={'body2'}>
                        {props.comment}
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeDialog} color="primary">
                        Закрыть
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

const mapStateToProps = (state: any) => {
    return {
        Auth: state.Auth,
        Admin: state.Admin,
        User: state.User
    }
}
const mapDispatchToProps = (dispatch: any) => {
    return {}
}
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ModalOrderComment))