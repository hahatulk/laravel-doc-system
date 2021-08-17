import React, {useEffect, useState} from "react";
import {Button, Card, CardActionArea, CardContent, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, IconButton, TextField, Typography} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";

export const OrderCardSpravkaObObuchenii = (props: any) => {
    const [open, setOpen] = useState<boolean>(false);
    const [title] = useState<string>('Справка с места обучения');
    const [description] = useState<string>('Справка с места обучения (для подтверждения факта обучения). Стандартного формата "по месту требования"');

    const [count, setCount] = useState<string | number>(1)
    const [comment, setComment] = useState<string>('')

    const [isSubmitting, setSubmitting] = useState<boolean>(false);

    function openDialog() {
        setOpen(true)
    }

    function closeDialog() {
        if (!isSubmitting) {
            setOpen(false)
        }
    }

    useEffect(() => {
        if (open) {
            setCount(1)
            setComment('')
        }
    }, [open])

    return (
        <>
            <Card className={'order-card'} elevation={2} onClick={() => {
                openDialog()
            }}>
                <CardActionArea>
                    <CardContent>
                        <Typography gutterBottom variant="body1">
                            {title}
                        </Typography>
                    </CardContent>
                </CardActionArea>
            </Card>
            <Dialog
                open={open}
                onClose={closeDialog}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <form onSubmit={(e: any) => {
                    e.preventDefault()
                    setSubmitting(true)

                    props.handleSubmit(
                        count,
                        comment,
                        () => {
                            setSubmitting(false)
                            setOpen(false)
                        }
                    )
                }}>
                    <DialogTitle disableTypography id="customized-dialog-title">
                        <Typography variant="h6">{title}</Typography>
                        <IconButton aria-label="close"
                                    style={{
                                        position: 'absolute',
                                        top: 0,
                                        right: 0,
                                        margin: '5px'
                                    }}
                                    onClick={closeDialog}>
                            <CloseIcon/>
                        </IconButton>
                    </DialogTitle>

                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            {description}
                        </DialogContentText>
                        <Grid container spacing={2}>

                            <Grid item xs={12} md={6}>
                                <TextField
                                    autoFocus
                                    margin="dense"
                                    label="Сколько экземпляров?"
                                    type="number"
                                    name={'count'}
                                    value={count}
                                    fullWidth
                                    inputProps={{min: 1, max: 2}}
                                    onChange={(e: any) => {
                                        setCount(e.target.value)
                                    }}
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <TextField
                                    margin="dense"
                                    label="Комментарий к заказу"
                                    name={'comment'}
                                    value={comment}
                                    fullWidth
                                    onChange={(e: any) => {
                                        setComment(e.target.value)
                                    }}
                                />
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button type={'submit'} color="primary">
                            Заказать
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        </>
    )
}

export const OrderCardSmenaFamilii = (props: any) => {
    const [open, setOpen] = useState<boolean>(false);
    const [title] = useState<string>('[TBD] Смена фамилии');
    const [description] = useState<string>('Заявка на смену фамилии.');

    const [count, setCount] = useState<string | number>(1)
    const [comment, setComment] = useState<string>('')

    const [isSubmitting, setSubmitting] = useState<boolean>(false);

    function openDialog() {
        setOpen(true)
    }

    function closeDialog() {
        if (!isSubmitting) {
            setOpen(false)
        }
    }

    useEffect(() => {
        if (open) {
            setCount(1)
            setComment('')
        }
    }, [open])

    return (
        <>
            <Card className={'order-card'} elevation={2} onClick={() => {
                openDialog()
            }}>
                <CardActionArea>
                    <CardContent>
                        <Typography gutterBottom variant="body1">
                            {title}
                        </Typography>
                    </CardContent>
                </CardActionArea>
            </Card>
            <Dialog
                open={open}
                onClose={closeDialog}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <form onSubmit={(e: any) => {
                    e.preventDefault()
                    setSubmitting(true)

                    props.handleSubmit(
                        count,
                        comment,
                        () => {
                            setSubmitting(false)
                            setOpen(false)
                        }
                    )
                }}>
                    <DialogTitle disableTypography id="customized-dialog-title">
                        <Typography variant="h6">{title}</Typography>
                        <IconButton aria-label="close"
                                    style={{
                                        position: 'absolute',
                                        top: 0,
                                        right: 0,
                                        margin: '5px'
                                    }}
                                    onClick={closeDialog}>
                            <CloseIcon/>
                        </IconButton>
                    </DialogTitle>

                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            {description}
                        </DialogContentText>
                        <Grid container spacing={2}>

                            <Grid item xs={12} md={6}>
                                <TextField
                                    autoFocus
                                    margin="dense"
                                    label="Сколько экземпляров?"
                                    type="number"
                                    name={'count'}
                                    value={count}
                                    fullWidth
                                    inputProps={{min: 1, max: 2}}
                                    onChange={(e: any) => {
                                        setCount(e.target.value)
                                    }}
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <TextField
                                    margin="dense"
                                    label="Комментарий к заказу"
                                    name={'comment'}
                                    value={comment}
                                    fullWidth
                                    onChange={(e: any) => {
                                        setComment(e.target.value)
                                    }}
                                />
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button type={'submit'} color="primary">
                            Заказать
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        </>
    )
}
