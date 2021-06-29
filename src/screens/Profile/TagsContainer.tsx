import {
  Box,
  createStyles,
  makeStyles,
  Theme,
  Chip,
  DialogContent,
} from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Tag } from '../../types';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    tag: {
      margin: '0.5em',
    },
    userTag: {
      color: '#eca245',
      fontWeight: 'bold',
    },
    availableTag: {
      color: 'white',
    },
  }),
);

const TagsContainer: React.FC<{
  userTags: Tag[];
  setUserTags: (tagsArray: Tag[]) => void;
  availableTags: Tag[];
  setAvailableTags: (tagArray: Tag[]) => void;
}> = ({ userTags, setUserTags, availableTags, setAvailableTags }) => {
  const classes = useStyles();
  const [tags, setTags] = useState<Array<Tag>>([]);

  useEffect(() => {
    const getTags = async () => {
      const tagsResponse = await axios.get<Array<Tag>>(
        `${process.env.REACT_APP_API_URL}/v1/tags`,
        {
          withCredentials: true,
        },
      );

      if (tagsResponse.data) {
        setTags([...tagsResponse.data]);
      }
    };
    console.log('appel des tags');
    getTags();
  }, []);

  useEffect(() => {
    const availableTags = tags.filter(
      (tag) => !userTags.some((userTag) => userTag.id === tag.id),
    );
    setAvailableTags([...availableTags]);
  }, [setAvailableTags, tags, userTags]);

  return (
    <DialogContent>
      {!!userTags.length && (
        <Box margin="3em 0">
          {userTags
            .sort((a: Tag, b: Tag) => a.name.localeCompare(b.name))
            .map((userTag) => (
              <Chip
                key={`tag${userTag.id}`}
                className={`${classes.tag} ${classes.userTag}`}
                label={userTag.name}
                onDelete={() => {
                  const newUserTagsList = userTags.filter(
                    (tag) => userTag.id !== tag.id,
                  );
                  setUserTags([...newUserTagsList]);
                }}
              />
            ))}
        </Box>
      )}
      {!!availableTags.length && (
        <Box margin="3em 0">
          {availableTags
            .sort((a: Tag, b: Tag) => a.name.localeCompare(b.name))
            .map((availableTag) => {
              return (
                <Chip
                  key={`tag${availableTag.id}`}
                  className={classes.tag}
                  label={availableTag.name}
                  onClick={() => {
                    const newUserTagsList = [...userTags];
                    newUserTagsList.push(availableTag);
                    setUserTags([...newUserTagsList]);
                  }}
                />
              );
            })}
        </Box>
      )}
    </DialogContent>
  );
};

export default TagsContainer;