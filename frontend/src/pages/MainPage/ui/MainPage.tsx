import React, { useState, useRef } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Stack,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import { Delete, Edit, UploadFile, Close } from '@mui/icons-material';
import { v4 as uuidv4 } from 'uuid';
import { AuthForm } from 'widjets/index';

// Types
interface BlogPost {
  id: string;
  date: string;
  message: string;
  media?: string[];
  author: string;
}

interface User {
  name: string;
}

// Mock user
const currentUser: User = {
  name: 'John Doe',
};

export const MainPage = () => {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [message, setMessage] = useState('');
    const [media, setMedia] = useState<string[]>([]);
    const [editingPostId, setEditingPostId] = useState<string | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
  
    const openAuthDialog = () => setIsAuthDialogOpen(true);
    const closeAuthDialog = () => setIsAuthDialogOpen(false);

    const openDialog = () => setIsDialogOpen(true);
    const closeDialog = () => {
    setIsDialogOpen(false);
    setMessage('');
    setMedia([]);
    setEditingPostId(null);
    };

    const handleMediaUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
        const readers = Array.from(files).map((file) => {
        return new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.readAsDataURL(file);
        });
        });
        Promise.all(readers).then((results) => {
        setMedia((prevMedia) => [...prevMedia, ...results]);
        });
    }
    };

    const handleDeleteMedia = (index: number) => {
    setMedia((prevMedia) => prevMedia.filter((_, i) => i !== index));
    };

    const handleAddOrEditPost = () => {
    if (editingPostId) {
        // Edit existing post
        setPosts((prevPosts) =>
        prevPosts.map((post) =>
            post.id === editingPostId
            ? { ...post, message, media }
            : post
        )
        );
    } else {
        // Add new post
        const newPost: BlogPost = {
        id: uuidv4(),
        date: new Date().toLocaleString(),
        message,
        media,
        author: currentUser.name,
        };
        setPosts((prevPosts) => [newPost, ...prevPosts]);
    }

    closeDialog();
    };

    const handleEdit = (id: string) => {
    const postToEdit = posts.find((post) => post.id === id);
    if (postToEdit) {
        setMessage(postToEdit.message);
        setMedia(postToEdit.media || []);
        setEditingPostId(postToEdit.id);
        openDialog();
    }
    };

    const handleDelete = (id: string) => {
    setPosts((prevPosts) => prevPosts.filter((post) => post.id !== id));
    };

    return (
    <Container maxWidth="sm">
        <Typography variant="h4" gutterBottom>
        Blog Page
        </Typography>
        <Button
                variant="contained"
                color="primary"
                onClick={openAuthDialog}
                style={{ marginBottom: '1rem' }}
        >Войти</Button>
        <AuthForm open={isAuthDialogOpen} onClose={closeAuthDialog}/>
        <Button
        variant="contained"
        color="primary"
        onClick={openDialog}
        style={{ marginBottom: '1rem' }}
        >
        Write a Post
        </Button>

        {posts.map((post) => (
        <Card key={post.id} style={{ marginBottom: '1rem' }}>
            <CardContent>
            <Typography variant="body2" color="textSecondary">
                {post.date}
            </Typography>
            <Typography variant="h6" gutterBottom>
                {post.message}
            </Typography>
            {post.media && post.media.map((item, index) => (
                item.startsWith('data:video') ? (
                <video
                    key={index}
                    src={item}
                    controls
                    style={{ width: '100%', maxHeight: '300px', objectFit: 'cover', marginBottom: '1rem' }}
                />
                ) : (
                <img
                    key={index}
                    src={item}
                    alt={`Media Content ${index}`}
                    style={{ width: '100%', maxHeight: '300px', objectFit: 'cover', marginBottom: '1rem' }}
                />
                )
            ))}
            <Typography variant="subtitle2" color="textSecondary">
                By {post.author}
            </Typography>
            </CardContent>
            {post.author === currentUser.name && (
            <CardActions>
                <IconButton
                color="primary"
                onClick={() => handleEdit(post.id)}
                >
                <Edit />
                </IconButton>
                <IconButton
                color="secondary"
                onClick={() => handleDelete(post.id)}
                >
                <Delete />
                </IconButton>
            </CardActions>
            )}
        </Card>
        ))}

        {/* Dialog for Add/Edit Post */}
        <Dialog open={isDialogOpen} onClose={closeDialog} fullWidth maxWidth="sm">
        <DialogTitle>{editingPostId ? 'Edit Post' : 'Write a Post'}</DialogTitle>
        <DialogContent>
            <TextField
            label="Message"
            fullWidth
            multiline
            rows={1}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            sx={{ marginBottom: '2rem', marginTop: "1rem" }}
            />
            <Stack direction="row" alignItems="center" spacing={2} style={{ marginBottom: '1rem' }}>
            <Button
                variant="outlined"
                startIcon={<UploadFile />}
                onClick={() => fileInputRef.current?.click()}
            >
                Upload Media
            </Button>
            <input
                type="file"
                accept="image/*,video/*"
                multiple
                onChange={handleMediaUpload}
                ref={fileInputRef}
                style={{ display: 'none' }}
            />
            </Stack>
            <Box display="flex" flexWrap="wrap" gap={2}>
            {media.map((item, index) => (
                <Box key={index} position="relative" width="100px" height="100px">
                {item.startsWith('data:video') ? (
                    <video
                    src={item}
                    controls
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                ) : (
                    <img
                    src={item}
                    alt={`Media Content ${index}`}
                    style={{ width: 'auto', height: 'auto', objectFit: 'cover' }}
                    />
                )}
                <IconButton
                    onClick={() => handleDeleteMedia(index)}
                    sx={{
                    width: "1.5rem",
                    height: "1.5rem",
                    position: 'absolute',
                    top: "0.2rem",
                    right: "0.2rem",
                    border: "2px solid",
                    borderColor: "#d3450f",
                    color: '#d3450f',
                    }}
                >
                    <Close sx={{fontSize: "1.2rem"}}/>
                </IconButton>
                </Box>
            ))}
            </Box>
        </DialogContent>
        <DialogActions>
            <Button onClick={closeDialog} color="secondary">
            Cancel
            </Button>
            <Button onClick={handleAddOrEditPost} color="primary">
            {editingPostId ? 'Update Post' : 'Add Post'}
            </Button>
        </DialogActions>
        </Dialog>
    </Container>
    );
};

