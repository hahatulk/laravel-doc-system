import React from 'react'
import {connect} from "react-redux"
import {withRouter} from "react-router"
import {AppBar, Button, Container, Drawer, Hidden, IconButton, List, ListItem, ListItemText, Toolbar, Typography,} from '@material-ui/core'
import MenuIcon from '@material-ui/icons/Menu'
import {logout} from "../../redux/actions/actionsAuth";
import Link from "../HOC/ProtectedLink";
import {AxiosResponse} from "axios";
import {SnackBarUtils} from "../SnackBarUtils/SnackBarUtils";
import {isMobile} from "react-device-detect";
import CloseIcon from "@material-ui/icons/Close";

function HeaderBar(props: any) {
    // const theme = useTheme();
    // const isMobile = useMediaQuery(theme.breakpoints.down("xs"));

    const [mobileOpen, setMobileOpen] = React.useState(false);

    function handleDrawerToggle() {
        setMobileOpen(!mobileOpen)
    }

    const MenuComponent = () => {
        return (
            <>
                <Container fixed className={'Header-NavbarContainer'}>
                    <List component="nav"
                          aria-labelledby="main navigation"
                          className={'Header-Navbar'}
                    >
                        <Link to={'/'}>
                            <ListItem button>
                                <ListItemText primary={'Личный кабинет'}/>
                            </ListItem>
                        </Link>

                        {
                            props.User.role === 'student'
                                ? (
                                    <>
                                        <Link to={'/order'}>
                                            <ListItem button>
                                                <ListItemText primary={'Заказать документ'}/>
                                            </ListItem>
                                        </Link>
                                    </>
                                )
                                : ''
                        }


                        {
                            props.User.role === 'admin'
                                ? (
                                    <>
                                        <Link to={'/students'}>
                                            <ListItem button>
                                                <ListItemText primary={'Студенты'}/>
                                            </ListItem>
                                        </Link>
                                        <Link to={'/orders'}>
                                            <ListItem button>
                                                <ListItemText primary={'Заказы'}/>
                                            </ListItem>
                                        </Link>
                                        <Link to={'/groups'}>
                                            <ListItem button>
                                                <ListItemText primary={'Группы'}/>
                                            </ListItem>
                                        </Link>
                                        <Link to={'/prikaz_list'}>
                                            <ListItem button>
                                                <ListItemText primary={'Приказы'}/>
                                            </ListItem>
                                        </Link>
                                        <Link to={'/moderators'}>
                                            <ListItem button>
                                                <ListItemText primary={'Администраторы'}/>
                                            </ListItem>
                                        </Link>
                                    </>
                                )
                                : ''
                        }

                        <Link action={'logout'}
                              className={'logout'}
                              onClick={(res: AxiosResponse) => {
                                  if (res.status === 200) {
                                      //показать уведомление о успешном выходе
                                      SnackBarUtils.info('Вы вышли из системы')
                                  } else {
                                      //показать уведомление о неудачонм выходе
                                      SnackBarUtils.error('Ошибка, попытайтесь выйти позднее')
                                  }
                              }}>
                            <ListItem button>
                                <Button color={'inherit'}
                                        variant={'outlined'}
                                >
                                    Выйти
                                </Button>
                            </ListItem>
                        </Link>
                    </List>


                </Container>
            </>
        )
    }

    return (
        <>
            <AppBar className={'HeaderBar'} position={"sticky"}>
                <Container>
                    <Toolbar className={'Header-ToolBar'}>
                        {
                            isMobile
                                ? <>
                                    <IconButton color="inherit"
                                                edge="start"
                                                aria-label="menu"
                                                onClick={handleDrawerToggle}
                                    >
                                        <MenuIcon/>
                                    </IconButton>
                                    <Hidden smUp implementation="css">
                                        <Drawer
                                            variant="temporary"
                                            open={mobileOpen}
                                            onClose={handleDrawerToggle}
                                            ModalProps={{
                                                keepMounted: true, // Better open performance on mobile.
                                            }}
                                        >
                                            <IconButton onClick={handleDrawerToggle}
                                                        color="inherit"
                                                        edge="start"
                                                        aria-label="menu">
                                                <CloseIcon/>
                                            </IconButton>
                                            <MenuComponent/>
                                        </Drawer>
                                    </Hidden>

                                </>
                                : ''
                        }
                        <Typography variant={'h6'} className={'Header-Title'}>
                            {
                                props.User.role
                                    ? props.User.role === 'student' ? 'Студент' : 'Учебная часть'
                                    : 'Загрузка...'
                            }
                        </Typography>

                        {
                            isMobile
                                ? ''
                                : <MenuComponent/>
                        }

                    </Toolbar>
                </Container>
            </AppBar>
        </>
    )
}

const mapStateToProps = (state: any) => {
    return {
        Auth: state.Auth,
        User: state.User
    }
}
const mapDispatchToProps = (dispatch: any) => {
    return {
        logout: () => {
            dispatch(logout());
        },
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(HeaderBar))