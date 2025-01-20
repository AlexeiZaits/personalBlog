import { Delete, Edit } from "@mui/icons-material";
import { Card, CardActions, CardContent, IconButton, Typography } from "@mui/material";
import { IAuthSlice } from "features/authorization/model/auth-slice";
import { BlogPost, checkVideo } from "pages/index";

interface IPostList {
    posts: BlogPost[],
    authSlice: IAuthSlice,
    handleEdit: (id: number) => void,
    handleDelete: (id: number) => void
}

export const PostList = ({posts, authSlice, handleEdit, handleDelete}: IPostList) => {
    
    const getLocalDate = (date: Date) => {
        const currentDate = new Date(date)
        return currentDate.toLocaleString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        }).replace(',', '');
    };

    return <>
    {posts.map((post) => (
        <Card key={post.id} style={{ marginBottom: '1rem' }}>
            <CardContent>
            <Typography variant="body2" color="textSecondary">
                {"Пост создан: " + getLocalDate(post.createdAt)}
            </Typography>
            <Typography variant="body2" color="textSecondary">
                { "Последнее обновление: " + getLocalDate(post.updatedAt)}
            </Typography>
            <Typography variant="h6" gutterBottom>
                {post.content}
            </Typography>
            {post.mediaUrls && post.mediaUrls.map((item, index) => {

                return checkVideo(item) ? (
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
                );
            })}
            <Typography variant="subtitle2" color="textSecondary">
                Автор {post.firstname+" "+post.lastname}
            </Typography>
            </CardContent>
            {post.userId === authSlice.user?.id && (
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
    </> 
}