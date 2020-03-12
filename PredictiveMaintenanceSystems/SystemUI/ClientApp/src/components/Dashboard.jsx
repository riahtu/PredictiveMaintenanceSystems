import React from 'react';
import clsx from 'clsx';
import Navigation from './Navigation';
import Desktop from './Desktop';
import {makeStyles} from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import Container from '@material-ui/core/Container';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import Settings from './Settings';
import Devices from './DataSource';
import UserProfile from './UserProfile';
import Workflow from './Workflow';

const Dashboard: React.FC = (props) => {
    const classes = useStyles();
    return (
        <BrowserRouter>
            <div className={clsx('App', classes.root)}>
                <CssBaseline/>
                <Drawer
                    variant="permanent"
                    classes={{
                        paper: classes.drawerPaper,
                    }}
                >
                    <UserProfile userData = {props.userData}/>
                    <Navigation/>
                </Drawer>
                <main className={classes.content}>
                    <Container maxWidth="lg" className={classes.container}>

                        <Switch>
                            <Route path="/" exact component={Desktop}/>
                            <Route path="/devices" component={Devices}/>
                            <Route path="/analytics" component={Workflow}/>
                            <Route path="/settings" component={Settings}/>
                        </Switch>

                    </Container>
                </main>
            </div>
        </BrowserRouter>
    );
};

const drawerWidth = 270;

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex'
    },
    drawerPaper: {
        position: 'relative',
        whiteSpace: 'nowrap',
        width: drawerWidth,
        paddingTop: theme.spacing(4),
        paddingBottom: theme.spacing(4),
        background: '#585858',
        color: '#fff'
    },
    content: {
        flexGrow: 1,
        height: '100vh',
        overflow: 'auto'
    },
    container: {
        paddingTop: theme.spacing(4),
        paddingBottom: theme.spacing(4)
    }
}));

export default Dashboard;