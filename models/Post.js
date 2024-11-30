const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
    title: {
        type: String,
        require: true,
    },
    content: {
        type: String,
        require: true,
    },
    iserId: {
        type: Schema.ObjectId,
        require: true,
    },
});

export const Post = mongoose.model('Post', postSchema);