import mime from "mime";
import { Post } from "../models";
import { yandexService } from "../service/yandexService";


class PostController {

    async createPost(req: any, res: any){
        try {
            const { content } = req.body;
            const media = req.files
            const {id, lastname, firstname} = req.user;
            const userId = id
            console.log(content, media.length)
            if (!content && (!media || !Array.isArray(media) || media.length === 0)) {
                return res.status(400).json({ error: "Content is required" });
            }

            const bucketName = 'personal-blog';

            const mediaUrls = [];
            for (const [index, file] of media.entries()) {
                const fileExtension = file.originalname.split('.').pop(); 
                const fileName = `media/${userId}/${Date.now()}_${index}.${fileExtension}`; 
                const fileUrl = await yandexService.uploadFileToYandex(file.buffer, bucketName, fileName);
                mediaUrls.push(fileUrl); 
            }
            
            // Сохранение поста в базе данных
            const post = await Post.create({ content, mediaUrls: mediaUrls, userId, lastname, firstname });
            return res.status(200).json(post);
            } catch (err) {
            console.error('Ошибка создания поста:', err);
            return res.status(500).json({ error: "Ошибка в создании новой записи" });
            }
    }
    
    async getPosts(req: any, res: any){
        try {
            const posts = await Post.findAll({ order: [["createdAt", "DESC"]] });
            res.json(posts);
        } catch (err) {
            res.status(500).json({ error: "Ошибка в получении всех записей" });
        }
    }
    
    async deletePost(req: any, res: any){
        try{
            const { id } = req.params;
            const userId = req.user.id;
            
            const post = await Post.findOne({ where: { id, userId } });
            if (!post) {
                return res.status(400).json({ error: "Пост не найден" });
            }
            
            const mediaUrls = post.mediaUrls;
    
            if (mediaUrls && mediaUrls.length > 0) {
                const fileNames = mediaUrls.map(url => {
                    const urlParts = url.split('media');
                    return "media"+urlParts[1];
                });
                
                await yandexService.deleteFilesFromYandex(fileNames);
            }
            
            await post.destroy();
            
            res.json({ message: "Пост успешно удалён" });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Ошибка в удаление поста" });
        }
    }

    async changePost (req: any, res: any){
        try {
            const { id } = req.params;
            const {content, mediaUrls} = req.body
            const userId = req.user.id;
            const media = req.files
            const post = await Post.findOne({ where: { id, userId } });
            const parseMediaUrls = JSON.parse(mediaUrls)
            console.log(parseMediaUrls)
            if (!post) {
                return res.status(400).json({ error: "Пост не найден" });
            }
            
            const bucketName = 'personal-blog';
            const mediaUrlsYandex = [];
            try {
                for (const [index, file] of media.entries()) {
                    const fileExtension = file.originalname.split('.').pop(); // Получение расширения
                    const fileName = `media/${userId}/${Date.now()}_${index}.${fileExtension}`; // Уникальное имя
                    const fileUrl = await yandexService.uploadFileToYandex(file.buffer, bucketName, fileName); // Загрузка
                    console.log({fileUrl: fileUrl});
                    mediaUrlsYandex.push(fileUrl); // Сохраняем ссылку на загруженный файл
                }
                
            } catch (error) {
                console.log("Ошибка в загрузке файлов")
            }

            post.content = content
            if (post.mediaUrls && post.mediaUrls.length > 0) {
                const deletePosts:string[] = [];
                post.mediaUrls.forEach((item) => {
                    if (!parseMediaUrls || !parseMediaUrls.includes(item)){
                        const urlParts = item.split('media');
                        deletePosts.push("media"+urlParts[1])
                    }
                })
                if (deletePosts.length > 0){
                    await yandexService.deleteFilesFromYandex(deletePosts as string[]);
                }
            }
            
            const safeParseMediaUrls = Array.isArray(parseMediaUrls) ? parseMediaUrls : [];
            const safeMediaUrlsYandex = Array.isArray(mediaUrlsYandex) ? mediaUrlsYandex : [];
            post.mediaUrls = [...safeParseMediaUrls, ...safeMediaUrlsYandex];
            if (!post.mediaUrls && !post.content){
                await post.destroy()
                res.json({message: "Пост успешно удалён"});
            } else {
                await post.save();
                res.json(post);
            }
            
            
        } catch (error) {
            res.status(500).json({ error: "Ошибка при изминение поста" });
        }
    }
    
}

export const postController = new PostController();
