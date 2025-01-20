import { Close, UploadFile } from "@mui/icons-material";
import { 
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    Stack,
    TextField 
} from "@mui/material";
import { useRef, useState } from "react";
import $client from "shared/api";
import * as api from "../../../config";
import { BlogPost, checkVideo } from "pages/MainPage";

interface DialogPostProps {
    open: boolean;
    message: string;
    media: string[];
    editingPostId: number | null;
    setMedia: React.Dispatch<React.SetStateAction<string[]>>;
    setMessage: React.Dispatch<React.SetStateAction<string>>;
    setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setEditingPostId: React.Dispatch<React.SetStateAction<number | null>>;
    setPosts: React.Dispatch<React.SetStateAction<BlogPost[]>>;
}

export const DialogPost = ({
    open,
    message,
    media,
    editingPostId,
    setMedia,
    setMessage,
    setIsDialogOpen,
    setEditingPostId,
    setPosts,
}: DialogPostProps) => {
    const [mediaFiles, setMediaFiles] = useState<File[]>([]);
    const [loading, setLoading] = useState(false); // Состояние загрузки
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    const closeDialog = () => {
        setIsDialogOpen(false);
        setMessage('');
        setMedia([]);
        setMediaFiles([]);
        setEditingPostId(null);
    };

    const handleMediaUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files) {
            setLoading(true); // Начало загрузки
            const readers = Array.from(files).map((file) => {
                return new Promise<string>((resolve) => {
                    const reader = new FileReader();
                    reader.onload = () => resolve(reader.result as string);
                    reader.readAsDataURL(file);
                });
            });
            try {
                const results = await Promise.all(readers);
                setMedia((prevMedia) => [...prevMedia, ...results]);
                setMediaFiles((prevMediaFiles) => [...prevMediaFiles, ...Array.from(files)]);
            } catch (error) {
                console.error("Ошибка при загрузке файлов:", error);
            } finally {
                setLoading(false); // Завершение загрузки
            }
        }
    };

    const handleDeleteMedia = (index: number) => {
        setMedia((prevMedia) => prevMedia.filter((_, i) => i !== index));
        setMediaFiles((prevMediaFiles) => prevMediaFiles.filter((_, i) => i !== index));
    };

    const handleAddOrEditPost = async () => {
        setLoading(true); // Начало загрузки при отправке
        const formData = new FormData();
        formData.append('content', message);

        if (mediaFiles) {
            mediaFiles.forEach((file) => formData.append('media', file));
        }

        try {
            if (editingPostId) {
                const currentMedia = media.filter((item) => item.includes("media"));
                formData.append('mediaUrls', JSON.stringify(currentMedia));
                
                const { data } = await $client.put(api.changePost(editingPostId), formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                setPosts((prevPosts) =>
                    prevPosts.map((post) => (post.id === editingPostId ? { ...data } : post))
                );
            } else {
                formData.append('mediaUrls', JSON.stringify(media));
                const { data } = await $client.post(api.addPost, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                setPosts((prevPosts) => [data, ...prevPosts]);
            }
        } catch (error) {
            console.error("Ошибка при сохранении поста:", error);
        } finally {
            setLoading(false); // Завершение загрузки
            closeDialog();
        }
    };

    return (
        <Dialog open={open} onClose={closeDialog} fullWidth maxWidth="sm">
            <DialogTitle>{editingPostId ? 'Изменить пост' : 'Написать пост'}</DialogTitle>
            <DialogContent>
                <TextField
                    label="Описание"
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
                        disabled={loading}
                    >
                        Загрузить
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
                            {item.startsWith('data:video') || checkVideo(item) ? (
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
                                <Close sx={{ fontSize: "1.2rem" }} />
                            </IconButton>
                        </Box>
                    ))}
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={closeDialog} variant="contained" color="error">
                    Отмена
                </Button>
                <Button
                    onClick={handleAddOrEditPost}
                    variant="contained"
                    color="primary"
                    loading={loading}
                >    
                    {editingPostId ? 'Обновить пост' : 'Добавить пост'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};
