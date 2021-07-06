import {
  Box,
  createStyles,
  makeStyles,
  Theme,
  Typography,
} from '@material-ui/core';
import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import ChannelList from '../components/ChannelList';
import NavBar from '../components/NavBar';
import { AuthContext } from '../context/auth';
import { Channel } from '../types';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      [theme.breakpoints.up('sm')]: {
        marginLeft: `240px`,
      },
    },
  }),
);

const HomeScreen: React.FC = () => {
  const classes = useStyles();
  const [loadingRecommendedChannels, setLoadingRecommendedChannels] =
    useState(true);
  const [userRecommendedChannels, setUserRecommendedChannels] =
    useState<Array<Channel> | null>(null);
  const [loadingJoinedChannels, setLoadingJoinedChannels] = useState(true);
  const [userJoinedChannels, setUserJoinedChannels] =
    useState<Array<Channel> | null>(null);

  const { user, login } = useContext(AuthContext);

  const getJoinedChannels = async () => {
    const channelsResponse = await axios.get(
      `${process.env.REACT_APP_API_URL}/v1/me/channels`,
      {
        withCredentials: true,
      },
    );

    if (channelsResponse.data) {
      setUserJoinedChannels(channelsResponse.data);
      setLoadingJoinedChannels(false);

      user!.channels = [...channelsResponse.data];
      login(user!);
    }
  };

  const getRecommendedChannels = async () => {
    const channelsResponse = await axios.get(
      `${process.env.REACT_APP_API_URL}/v1/me/recommended`,
      {
        withCredentials: true,
      },
    );

    if (channelsResponse.data) {
      setUserRecommendedChannels(channelsResponse.data);
      setLoadingRecommendedChannels(false);
    }
  };

  useEffect(() => {
    getRecommendedChannels();
    getJoinedChannels();
  }, []);

  return (
    <>
      <NavBar />
      <Box className={classes.root}>
        <Typography variant="h4">Tes Salons</Typography>
        {user && user.channels && user.channels.length > 0 ? (
          <ChannelList
            loading={loadingJoinedChannels}
            channels={userJoinedChannels}
          />
        ) : (
          <Box paddingY="10px">
            <Typography>
              Tu n'as encore rejoint aucun salon, mais pas de panique ! Une
              sélection toute prête t'attend juste en dessous !
            </Typography>
          </Box>
        )}

        <Typography variant="h4">Recommandé pour toi</Typography>
        <ChannelList
          loading={loadingRecommendedChannels}
          channels={userRecommendedChannels}
        />
      </Box>
    </>
  );
};

export default HomeScreen;
