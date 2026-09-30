import "dotenv/config";
import mongoose from "mongoose";
import User from "./src/models/user.model.js";
import Message from "./src/models/message.model.js";

const DB_URL = process.env.DB_URL;

const seedDatabase = async () => {
    try {
        await mongoose.connect(DB_URL);
        console.log("Connected to MongoDB for seeding...");

        // Create sample users
        const users = [
            {
                clerkId: "user_sample_1",
                email: "alice@example.com",
                fullName: "Alice Smith",
                profilePic: "https://i.pravatar.cc/150?u=alice",
            },
            {
                clerkId: "user_sample_2",
                email: "bob@example.com",
                fullName: "Bob Johnson",
                profilePic: "https://i.pravatar.cc/150?u=bob",
            },
            {
                clerkId: "user_sample_3",
                email: "charlie@example.com",
                fullName: "Charlie Brown",
                profilePic: "https://i.pravatar.cc/150?u=charlie",
            },
        ];

        // Insert or update users based on email
        const insertedUsers = [];
        for (const userData of users) {
            let user = await User.findOne({ email: userData.email });
            if (!user) {
                user = await User.create(userData);
            }
            insertedUsers.push(user);
        }

        console.log("Sample users ensured in the database.");

        const [alice, bob, charlie] = insertedUsers;

        // Clear existing sample messages between these users to avoid duplicates (optional, we can just insert)
        await Message.deleteMany({
            senderId: { $in: [alice._id, bob._id, charlie._id] },
            receiverId: { $in: [alice._id, bob._id, charlie._id] }
        });

        // Create sample messages
        const messages = [
            { senderId: alice._id, receiverId: bob._id, text: "Hi Bob, how are you?" },
            { senderId: bob._id, receiverId: alice._id, text: "I'm good Alice! Thanks for asking." },
            { senderId: alice._id, receiverId: bob._id, text: "Have you seen the new project updates?" },
            { senderId: bob._id, receiverId: alice._id, text: "Yes, they look great." },
            { senderId: charlie._id, receiverId: alice._id, text: "Hey Alice, do you have a moment?" },
            { senderId: alice._id, receiverId: charlie._id, text: "Sure Charlie, what's up?" },
        ];

        await Message.insertMany(messages);
        console.log("Sample messages created successfully.");

        process.exit(0);
    } catch (error) {
        console.error("Error seeding database:", error);
        process.exit(1);
    }
};

seedDatabase();
