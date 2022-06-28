const {User, Thought} = require('../models');

const thoughtController = {
    async getAllThoughts(req, res) {
        try {
            let thoughts = await Thought.find({}).populate({path: 'reactions', select: '-__v'}).select('-__v').sort({_id: -1});
            res.json(thoughts)
        }
        catch (err) {
            console.log(err);
            res.status(400).json(err);
        }
    },
    async getThoughtById({params}, res) {
        try {
            let thought = await Thought.findOne({_id: params.id}).populate({path: 'reactions', select: '-__v'}).select('-__v');
            if (!thought) {
                res.status(404).json({message: 'No thought found with this id!'});
                return;
            }
            res.json(thought);
        }
        catch (err) {
            console.log(err);
            res.status(400).json(err);
        }
    },
    async createThought({params, body}, res) {
        try {
            console.log(body);
            let thought = await Thought.create(body);
            let update = await User.findOneAndUpdate({_id: params.userId}, {$push: {thoughts: thought._id}}, {new: true});
            if (!update) {
                res.status(404).json({message: 'No user found with this id!'});
                return;
            }
            res.json(update);
        }
        catch (err) {
            console.log(err);
            res.json(err);
        }
    },
    async updateThought({params, body}, res) {
        try {
            let thought = await Thought.findOneAndUpdate({_id: params.id}, body, {new: true, runValidators});
            if (!thought) {
                res.status(404).json({message: 'No pizza found with this id!'});
                return;
            }
            res.json(thought);
        }
        catch (err) {
            console.log(err);
            res.status(400).json(err);
        }
    },
    async deleteThought({params}, res) {
        try {
            let thought = await Thought.findOneAndDelete({_id: params.thoughtId});
            if (!thought) {
                res.status(404).json({message: 'No thought with this id!'});
                return;
            }
            let updated = await User.findOneAndUpdate({_id: params.userId}, {$pull: {thoughts: params.thoughtId}}, {new: true});
            if (!updated) {
                res.status(404).json({message: 'No user found with this id!'});
                return;
            }
            res.json(updated);
        }
        catch (err) {
            console.log(err);
            res.json(err);
        }
    },
    async addReaction({params, body}, res) {
        try {
            let reaction = await Thought.findOneAndUpdate({_id: params.thoughtId}, {$push: {reactions: body}}, {new: true, runValidators: true});
            if (!reaction) {
                res.status(404).json({message: 'No thought found with this id!'});
                return;
            }
            res.json(thought);
        }
        catch (err) {
            console.log(err);
            res.json(err);
        }
    },
    async removeReaction({params}, res) {
        try {
            let reaction = Thought.findOneAndUpdate({_id: params.thoughtId}, {$pull: {reactions: {reactionId: params.reactionId}}}, {new: true});
            res.json(reaction);
        }
        catch (err) {
            console.log(err);
            res.json(err);
        }
    }
}

module.exports = thoughtController;