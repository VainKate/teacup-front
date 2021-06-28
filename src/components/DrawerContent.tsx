import {
  Avatar,
  Box,
  createStyles,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles,
  Typography,
} from '@material-ui/core';
import axios from 'axios';
import { Link, useHistory } from 'react-router-dom';
import HomeIcon from '@material-ui/icons/Home';
import ForumIcon from '@material-ui/icons/Forum';
import SettingsIcon from '@material-ui/icons/Settings';
import PowerSettingsNewIcon from '@material-ui/icons/PowerSettingsNew';
import { useContext } from 'react';
import { AuthContext } from '../context/auth';

const useStyles = makeStyles(() =>
  createStyles({
    channelName: {
      marginLeft: '10px',
    },
  }),
);

const DrawerContent: React.FC = () => {
  const history = useHistory();
  const { user, logout } = useContext(AuthContext);
  const classes = useStyles();

  const onLogout = async () => {
    await axios(`${process.env.REACT_APP_API_URL}/v1/logout`, {
      method: 'post',
      withCredentials: true,
    });

    logout();
    history.replace('/');
  };

  return (
    <Box paddingBottom="60px">
      <List>
        <ListItem button key={'home'} component={Link} to="/">
          <ListItemIcon>
            <HomeIcon />
          </ListItemIcon>
          <ListItemText primary={'Accueil'} />
        </ListItem>
        <ListItem button key={'discover'} component={Link} to="/discover">
          <ListItemIcon>
            <ForumIcon />
          </ListItemIcon>
          <ListItemText primary={'Découvrir'} />
        </ListItem>
      </List>
      {user && user.channels && user.channels.length > 0 && (
        <>
          <Divider />
          <List>
            {user.channels.map((channel) => (
              <ListItem
                button
                key={channel.id}
                component={Link}
                to={`/channel/${channel.id}`}
              >
                <Avatar>{channel.title.slice(0, 1)}</Avatar>
                <Typography component="p" className={classes.channelName}>
                  {channel.title}
                </Typography>
              </ListItem>
            ))}
          </List>
        </>
      )}
      <Divider />
      <List>
        <ListItem button key={'profile'} component={Link} to="/profile">
          <ListItemIcon>
            <SettingsIcon />
          </ListItemIcon>
          <ListItemText primary={'Paramètres'} />
        </ListItem>
        <ListItem button key={'logout'} onClick={onLogout}>
          <ListItemIcon>
            <PowerSettingsNewIcon />
          </ListItemIcon>
          <ListItemText primary={'Se déconnecter'}></ListItemText>
        </ListItem>
      </List>
    </Box>
  );
};

export default DrawerContent;
