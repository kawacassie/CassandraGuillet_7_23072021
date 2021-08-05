import Api from '../services/Api';

export default {
    getAllPosts(){
        return Api().get('posts');
    },
    getOnePost(id){
        return Api().get('posts/' + id);
    },
    createPost(data){
        return Api().post('posts/add', data);
    },
    modifyPost(id, data){
        return Api().put('posts/' + id, data);
    },
    deletePost(id){
        return Api().delete('posts/' + id);
    },
    likeOrDislike(id){
        return Api().post('posts/' + id + '/like');
    },
    addComment(id, data){
        return Api().post('posts/' + id + '/comments', data);
    },
    deleteComment(id){
        return Api().delete('posts/comments/' + id);
    },
};