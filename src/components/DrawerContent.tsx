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
        <ListItem button key={'home'} component={Link} to="/home">
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
