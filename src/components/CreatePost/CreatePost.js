import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  IconButton,
  Chip,
  Autocomplete,
  Modal,
  CircularProgress,
  useTheme,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import ImageIcon from "@mui/icons-material/Image";
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";
import CloseIcon from "@mui/icons-material/Close";
import { useDispatch, useSelector } from "react-redux";
import { popComponent } from "../../Features/StackSlice";
import { addNewPost } from "../../Features/PostSlice";
import { useCreatePostMutation } from "../../Features/postApi";
import { useError } from "../Errors/Errors";
import { useGetMentionedUsersQuery } from "../../Features/userApi";
import {
  searchMentionedGroups,
  searchMentionedUsers,
} from "../../Features/SearchSlice";
import PostTextArea from "../PostTextArea/PostTextArea";
import MentionedUsersList from "../MentionedUsersList/MentionedUsersList";
import MentionedGroupsList from "../MentionedGroupsList/MentionedGroupsList";
import LinksPreview from "../LinksPreview/LinksPreview";
import TagsInput from "../TagsInput/TagsInput";
import MediaUploader from "../GroupConversation/MediaUploader/MediaUploader";
import MediaPreviewGrid from "../MediaPreviewGrid/MediaPreviewGrid";
import PostActions from "../PostActions/PostActions";

const CreatePost = () => {
  const [content, setContent] = useState("");
  const [mediaList, setMediaList] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const dispatch = useDispatch();
  const predefinedTags = [];
  const { message, setMessage } = useError();
  const [createPost, { isLoading, error }] = useCreatePostMutation();
  const [mentions, setMentions] = useState([]);
  const [groups, setGroups] = useState([]);
  const [links, setLinks] = useState([]);
  // const { mentionedUSers } = useSelector((state) => state.search);
  const [mentionedUSers, setMentionedUSers] = useState([]);
  const [mentionedGroups, setMentionedGroups] = useState([]);

  // const { data, refetch } = useGetMentionedUsersQuery({
  //   offset: 0,
  //   limit: 10,
  // });
  const theme = useTheme();

  useEffect(() => {
    if (content == "") {
      setMentionedUSers([]);
    }
  }, [content]);

  useEffect(() => {
    if (!mentions) return;
    const delayDebounce = setTimeout(() => {
      const formData = new FormData();
      mentions.forEach((m) => formData.append("usernames", m));
      dispatch(searchMentionedUsers({ formData }))
        .unwrap()
        .then((payload) => {
          setMentionedUSers(payload.results);
        });
    }, 500);
    return () => {
      clearTimeout(delayDebounce);
    };
  }, [mentions, dispatch]);

  useEffect(() => {
    if (!groups) return;
    const delayDebounce = setTimeout(() => {
      const formData = new FormData();
      groups.forEach((m) => formData.append("name", m));
      dispatch(searchMentionedGroups({ formData }))
        .unwrap()
        .then((payload) => {
          setMentionedGroups(payload.results);
        });
    }, 500);
    return () => {
      clearTimeout(delayDebounce);
    };
  }, [groups, dispatch]);

  const handleRemoveMedia = (index) => {
    setMediaList((prev) => prev.filter((_, i) => i !== index));
  };

  const handleContentChange = (e) => {
    const text = e.target.value;
    setContent(text);

    // Mentions: @username (letters, numbers, underscores allowed)
    const foundMentions = text.match(/@\w+/g) || [];

    // Groups: #groupname (example, adjust to your format)
    const foundGroups = text.match(/#\w+/g) || [];

    // Links: simple URL regex (http/https)
    const foundLinks = text.match(/https?:\/\/[^\s]+/g) || [];

    // Remove @ symbol if you just want names
    const cleanedMentions = foundMentions.map((m) => m.slice(1));

    setMentions(cleanedMentions);
    setGroups(foundGroups.map((g) => g.slice(1)));
    setLinks(foundLinks);
  };

  useEffect(() => {
    if (error) {
      const errMsg =
        error?.data?.detail ||
        error?.error ||
        "Something went wrong while creating the post.";
      setMessage(errMsg);
    }
  }, [error, setMessage]);

  const handleMediaUpload = (event, type) => {
    const files = Array.from(event.target.files);
    const newMedia = files.map((file) => {
      const preview = URL.createObjectURL(file);
      return { file, type, preview };
    });
    setMediaList((prev) => [...prev, ...newMedia]);
  };

  const handlePost = async () => {
    if (!content && mediaList.length === 0) return;
    const formData = new FormData();
    formData.append("content", content);
    if (selectedTags.length) {
      formData.append("tags", selectedTags.join(","));
    }
    mediaList.forEach((m, idx) => {
      formData.append("files", m.file);
    });

    let has_video = 0;
    mediaList.forEach((m) => {
      if (m.type === "video") has_video = 1;
    });

    formData.append("has_video", has_video);

    const payload = await createPost({ formData }).unwrap();
    console.log("payload", payload);
    dispatch(addNewPost({ payload }));

    setContent("");
    setMediaList([]);
    setSelectedTags([]);
    dispatch(popComponent());
  };

  const handleTagChange = (event, value) => setSelectedTags(value);

  return (
    <Modal open={true} aria-labelledby="modal-modal-title">
      <Card
        sx={{
          maxWidth: 500,
          margin: "auto",
          mt: 4,
          borderRadius: 3,
          p: 2,
          backgroundColor: theme.palette.background.paper,
          boxShadow: theme.shadows[5],
          border: `1px solid ${theme.palette.divider}`,
        }}
      >
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Create a Post
          </Typography>

          <PostTextArea
            content={content}
            setContent={setContent}
            setMentions={setMentions}
            setGroups={setGroups}
            setLinks={setLinks}
            isLoading={isLoading}
          />
          <MentionedUsersList users={mentionedUSers} />
          <MentionedGroupsList groups={mentionedGroups} />
          <LinksPreview links={links} />

          <TagsInput
            selectedTags={selectedTags}
            setSelectedTags={setSelectedTags}
            isLoading={isLoading}
          />

          <MediaUploader setMediaList={setMediaList} isLoading={isLoading} />
          <MediaPreviewGrid
            mediaList={mediaList}
            handleRemoveMedia={handleRemoveMedia}
            isLoading={isLoading}
          />

          <PostActions
            onCancel={() => dispatch(popComponent())}
            onPost={handlePost}
            disabled={(!content && mediaList.length === 0) || isLoading}
            isLoading={isLoading}
          />
        </CardContent>
      </Card>
    </Modal>
  );
};

export default CreatePost;
