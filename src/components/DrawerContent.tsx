import { List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import { Link } from 'react-router-dom';
import HomeIcon from '@material-ui/icons/Home';
import ForumIcon from '@material-ui/icons/Forum';

const DrawerContent: React.FC = () => {
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
    </div>
  );
};

export default DrawerContent;
