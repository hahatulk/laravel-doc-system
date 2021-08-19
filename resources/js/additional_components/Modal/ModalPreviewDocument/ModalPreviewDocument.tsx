import React, {useState} from 'react'
import {connect} from "react-redux"
import {withRouter} from "react-router"
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid} from "@material-ui/core";

function PrepareOrder(props: any) {
    const previewedURL: string = props.previewedURL

    const [open, setOpen] = useState(false);
    const [link, setLink] = useState(`https://docs.google.com/viewer?embedded=true&url=${encodeURIComponent(previewedURL)}`);

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
                Предпросмотр
            </Button>
            <Dialog
                open={open}
                maxWidth={'lg'}
                fullWidth={true}
                onClose={closeDialog}
                aria-labelledby="form-dialog-title"
            >
                <DialogTitle id="form-dialog-title">Предпросмотр документа</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2}>

                        <Grid item xs={12} md={12}>
                            <iframe
                                width={'100%'}
                                height={'600px'}
                                src={link}
                                frameBorder="0"
                            >
                            </iframe>
                        </Grid>

                        <Grid item xs={12} md={12}>
                            <Button color={'primary'}
                                    variant={'contained'}
                                    onClick={() => {
                                        setLink(link + ' ')
                                    }}
                            >
                                Обновить
                            </Button>
                        </Grid>

                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeDialog} color="primary">
                        Отмена
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

const mapStateToProps = (state: any) => {
    return {}
}
const mapDispatchToProps = (dispatch: any) => {
    return {}
}
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(PrepareOrder))
