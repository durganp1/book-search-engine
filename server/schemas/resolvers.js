

const {AuthenticationError} = require('apollo-server-express');
const {User} = require('../models');
const {signToken} = require('../utils/auth');

const resolvers = {
    Query: {
        me: async (obj, args, context) => {
            if (context.user) {
                const userData = await User.findOne({_id: context.user._id})
                .select('-__v -password')
                .populate('books');
                return userData;
            }
            throw new AuthenticationError('You are not logged in');
        }
    },

    Mutation: {
        addUser: async (obj, args) => {
            const user = await User.create(args);
            const token = signToken(user);

            return {token, user};
        },

        login: async (obj, {email, password}) => {
            const user = await User.findOne({email});

            if (!user) {
                throw new AuthenticationError('Incorrect Credentials');
            }
            const correctPw = await user.isCorrectPassword(password);

            if (!correctPw) {
                throw new AuthenticationError('Incorrect credendials');
            }

            const token = signToken(user);
            return {token, user};
        },

        saveBook: async (obj, {bookData}, context) => {
            if (context.user) {
                const updatedUser = await User.findByIdAndUpdate(
                    {_id: context.user._id},
                    {$push:{savedBooks: {bookId}}},
                    {new: true}
                );

                return updatedUser;
            }

            throw new addEventListener('You need to be logged in to save a book');
        },

        removeBook: async (obj, {bookId}, context) => {
            if (context.user) {
                const updatedUser = await User.findOneAndUpdate(
                    {_id: context.user._id},
                    { $pull: {savedBooks: {bookId}}},
                    { new: true }
                );

                return updatedUser;
            }

            throw new AuthenticationError('You need to be logged in to remove a book');
        }
    },
};

module.exports = resolvers;
