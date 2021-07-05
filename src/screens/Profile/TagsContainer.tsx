import {
  Box,
  createStyles,
  makeStyles,
  Theme,
  Chip,
  Typography,
  CircularProgress,
} from '@material-ui/core';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

import { Tag } from '../../types';
import { useHistory } from 'react-router-dom';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    tag: {
      margin: '0.5em',
      '&:hover': {
        backgroundColor: '#eca245',
        border: '2px solid #eca245',
        fontWeight: 'bold',
        color: 'white',
      },
    },
    userTag: {
      color: 'black',
      backgroundColor: '#f7be2e',
    },
    icon: {
      color: 'blue',
    },
  }),
);

const TagsContainer: React.FC<{
  userTags: Tag[];
  selectTag: (tag: Tag) => void;
  unselectTag: (tag: Tag) => void;
}> = ({ userTags, selectTag, unselectTag }) => {
  const classes = useStyles();
  const [loading, setLoading] = useState(true);
  const history = useHistory();

  const [tags, setTags] = useState<Array<Tag>>([]);
  const [availableTags, setAvailableTags] = useState<Array<Tag>>([]);

  useEffect(() => {
    const getTags = async () => {
      try {
        const tagsResponse = await axios.get<Array<Tag>>(
          `${process.env.REACT_APP_API_URL}/v1/tags`,
          {
            withCredentials: true,
          },
        );

        if (tagsResponse.data) {
          setTags([...tagsResponse.data]);
        }

        setLoading(false);
      } catch (error) {
        history.replace('/');
      }
    };

    getTags();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const availableTags = tags.filter(
      (tag) => !userTags.some((userTag) => userTag.id === tag.id),
    );
    setAvailableTags([...availableTags]);
  }, [tags, userTags]);

  return (
    <>
      {!!userTags.length && (
        <Box margin="3em 0">
          {userTags
            .sort((a: Tag, b: Tag) => a.name.localeCompare(b.name))
            .map((userTag) => (
              <Chip
                key={`tag${userTag.id}`}
                className={`${classes.tag} ${classes.userTag}`}
                label={userTag.name}
                onClick={() => unselectTag(userTag)}
                onDelete={() => unselectTag(userTag)}
              />
            ))}
        </Box>
      )}

      <Typography>
        Ajoute d'autres centres d'intérêt parmi ceux disponibles :
      </Typography>
      {loading ? (
        <CircularProgress />
      ) : (
        !!availableTags.length && (
          <Box margin="3em 0">
            {availableTags
              .sort((a: Tag, b: Tag) => a.name.localeCompare(b.name))
              .map((availableTag) => (
                <Chip
                  key={`tag${availableTag.id}`}
                  className={classes.tag}
                  label={availableTag.name}
                  onClick={() => selectTag(availableTag)}
                  onDelete={() => selectTag(availableTag)}
                  deleteIcon={<AddCircleIcon className="icon" />}
                />
              ))}
          </Box>
        )
      )}
    </>
  );
};

export default TagsContainer;
