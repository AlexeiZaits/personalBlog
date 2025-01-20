import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Button,
  Box,
} from '@mui/material';
import { AuthForm, DialogPost } from 'widjets/index';
import { useActionsAuthorization } from 'features/authorization/hooks/use-actions-authorization';
import { useAuthorization } from 'features/authorization/hooks/use-authorization';
import * as api from "../../../config";
import $client from 'shared/api';
import { PostList } from 'features/postList/ui/PostList';

export interface BlogPost {
    content: string,
    createdAt: Date,
    firstname: "lexa",
    id: number,
    lastname: "string",
    mediaUrls: string[],
    updatedAt: Date,
    userId: string
}

export const checkVideo = (item:string) => {
    const videoFormats = ['mp4', 'webm', 'ogg', 'avi', 'mov', 'mkv'];
    return videoFormats.some((format) => item.toLowerCase().includes(`.${format}`));
}

export const MainPage = () => {
    const handleActions = useActionsAuthorization()
    const [, authSlice] = useAuthorization()
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [message, setMessage] = useState('');
    const [media, setMedia] = useState<string[]>([]);
    const [editingPostId, setEditingPostId] = useState<number | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
    
    useEffect(() => {
        handleActions("refresh")
    }, [])

    useEffect(() => {
        $client.get(api.getPosts)
        .then((data) => {
            setPosts(data.data)
        })

    }, [])

    const handelQuit = () => handleActions("logout")
    const openAuthDialog = () => setIsAuthDialogOpen(true);
    const closeAuthDialog = () => setIsAuthDialogOpen(false);
    const openDialog = () => setIsDialogOpen(true);

    const handleEdit = (id: number) => {
        const postToEdit = posts.find((post) => post.id === id);
        if (postToEdit) {
            setMessage(postToEdit.content);
            setMedia(postToEdit.mediaUrls || []);
            setEditingPostId(postToEdit.id);
            openDialog();
        }
    };
    
    const handleDelete = (id: number) => {
        setPosts((prevPosts) => prevPosts.filter((post) => post.id !== id));
        $client.delete(api.deletePost(id))
        .then((data) => {
            console.log(data)
        })
        .catch((error) => {
            console.log(error)
        })
    };

    return (
    <Container maxWidth="sm" sx={{display: "grid", gap: "30px"}}>
        <Container  sx={{display: "flex", flexDirection: "row", justifyContent: "space-between", marginTop: "1rem", padding: "0rem !important"}}>
            <Box>
                <Typography variant="h5">
                    Блог постов
                </Typography>
            </Box>
            <Box display={"flex"} flexDirection={"row"} justifyContent={"end"} alignItems={"center"}>
                <Typography mr={1}>  
                    {authSlice.user ? authSlice.user?.firstname + " " + authSlice.user?.lastname: "Неизвестный пользователь"}
                </Typography>
                <Button
                    sx={{fontSize: "0.7rem"}}
                    variant="contained"
                    color="primary"
                    onClick={authSlice.isAuth ? handelQuit : openAuthDialog}
                >{authSlice.isAuth ? "Выход": "Войти"}</Button>
            </Box>
        </Container>
        <AuthForm open={isAuthDialogOpen} onClose={closeAuthDialog}/>
        <DialogPost open={isDialogOpen} message={message} 
        media={media} editingPostId={editingPostId} 
        setMedia={setMedia} setEditingPostId={setEditingPostId}
        setIsDialogOpen={setIsDialogOpen} setPosts={setPosts}
        setMessage={setMessage}
        />
        <Box>
            <Button
            variant="contained"
            color="primary"
            onClick={authSlice.isAuth ? openDialog : openAuthDialog}
            >
            Написать пост
            </Button>
        </Box>
        <Box>
            <PostList posts={posts} authSlice={authSlice} handleDelete={handleDelete} handleEdit={handleEdit}/>
        </Box>
    </Container>
    );
};

