import {
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@material-ui/core';
import { Link } from 'react-router-dom';
import HomeIcon from '@material-ui/icons/Home';
import ForumIcon from '@material-ui/icons/Forum';
import PowerSettingsNewIcon from '@material-ui/icons/PowerSettingsNew';
import { useContext } from 'react';
import { AuthContext } from '../context/auth';

const DrawerContent: React.FC = () => {
  const { user, logout } = useContext(AuthContext);

  const onLogout = () => {
    logout();
  };
  return (
    <div>
      <List>
        <Link to="/home">
          <ListItem button key={'home'}>
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary={'Accueil'} />
          </ListItem>
        </Link>
        <Link to="/discover">
          <ListItem button key={'discover'}>
            <ListItemIcon>
              <ForumIcon />
            </ListItemIcon>
            <ListItemText primary={'Découvrir'} />
          </ListItem>
        </Link>
      </List>
      <Divider />
      <List>
        <ListItem button key={'logout'} onClick={onLogout}>
          <ListItemIcon>
            <PowerSettingsNewIcon />
          </ListItemIcon>
          <ListItemText primary={'Log out'}></ListItemText>
        </ListItem>
      </List>
    </div>
  );
};

export default DrawerContent;
