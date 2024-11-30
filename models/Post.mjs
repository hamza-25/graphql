import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const postSchema = new Schema({
    title: {
        type: String,
        trim: true,
        require: true,
    },
    content: {
        type: String,
        trim: true,
        require: true,
    },
    userId: {
        type: Schema.ObjectId,
        require: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

export default mongoose.model('Post', postSchema);