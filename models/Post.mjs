import mongoose from 'mongoose';
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
    userId: {
        type: Schema.ObjectId,
        require: true,
    },
});

export default mongoose.model('Post', postSchema);