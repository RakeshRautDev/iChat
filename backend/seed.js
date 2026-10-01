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
                clerkId: "user_3K3AwUo5C0vsRaNTUNBHrZtXslq", // Your actual Clerk ID
                email: "myaccount@example.com",
                fullName: "My Logged-in Account",
                profilePic: "https://i.pravatar.cc/150?u=alice",
            },
            { clerkId: "user_sample_2", email: "bob@example.com", fullName: "Bob Johnson", profilePic: "https://i.pravatar.cc/150?u=bob" },
            { clerkId: "user_sample_3", email: "charlie@example.com", fullName: "Charlie Brown", profilePic: "https://i.pravatar.cc/150?u=charlie" },
            { clerkId: "user_sample_4", email: "david@example.com", fullName: "David Lee", profilePic: "https://i.pravatar.cc/150?u=david" },
            { clerkId: "user_sample_5", email: "eve@example.com", fullName: "Eve Adams", profilePic: "https://i.pravatar.cc/150?u=eve" },
        ];

        // Insert or update users based on clerkId
        const insertedUsers = [];
        for (const userData of users) {
            let user = await User.findOne({ clerkId: userData.clerkId });
            if (!user) {
                user = await User.create(userData);
            }
            insertedUsers.push(user);
        }

        console.log("Sample users ensured in the database.");
        const [me, bob, charlie, david, eve] = insertedUsers;

        // Clear existing sample messages
        const allUserIds = insertedUsers.map(u => u._id);
        await Message.deleteMany({
            senderId: { $in: allUserIds },
            receiverId: { $in: allUserIds }
        });

        const messages = [];

        // Helper to get a date n days ago
        const getPastDate = (daysAgo, hoursAgo = 0, minutesAgo = 0) => {
            const date = new Date();
            date.setDate(date.getDate() - daysAgo);
            date.setHours(date.getHours() - hoursAgo);
            date.setMinutes(date.getMinutes() - minutesAgo);
            return date;
        };

        // 1. Very long conversation with Bob (35 messages)
        const bobChat = [
            { senderId: me._id, receiverId: bob._id, text: "Hey Bob, are we still on for the weekend trip?", createdAt: getPastDate(7, 10) },
            { senderId: bob._id, receiverId: me._id, text: "Yes definitely! I was thinking of heading to the mountains.", createdAt: getPastDate(7, 9, 30) },
            { senderId: me._id, receiverId: bob._id, text: "Sounds perfect. Did you book the cabin?", createdAt: getPastDate(7, 9, 25) },
            { senderId: bob._id, receiverId: me._id, text: "I did. Here is a picture of the place!", image: "https://images.unsplash.com/photo-1542718610-a1d656d1884c?w=600&auto=format&fit=crop&q=60", createdAt: getPastDate(7, 9, 20) },
            { senderId: me._id, receiverId: bob._id, text: "Wow, that looks amazing! It even has a lake.", createdAt: getPastDate(7, 9, 15) },
            { senderId: bob._id, receiverId: me._id, text: "Right? The reviews were really good too.", createdAt: getPastDate(7, 9, 10) },
            { senderId: me._id, receiverId: bob._id, text: "Did you check the weather?", createdAt: getPastDate(7, 9, 5) },
            { senderId: bob._id, receiverId: me._id, text: "It's supposed to be sunny but cold at night.", createdAt: getPastDate(7, 9, 0) },
            
            { senderId: bob._id, receiverId: me._id, text: "I'll send you the address soon.", createdAt: getPastDate(6, 5) },
            { senderId: me._id, receiverId: bob._id, text: "Thanks! What should I pack?", createdAt: getPastDate(6, 4, 30) },
            { senderId: bob._id, receiverId: me._id, text: "Warm clothes, hiking boots, and maybe some snacks.", createdAt: getPastDate(6, 4, 15) },
            { senderId: me._id, receiverId: bob._id, text: "Got it. I need to buy new boots actually.", createdAt: getPastDate(6, 4, 10) },
            { senderId: bob._id, receiverId: me._id, text: "There is a sale at the outdoor store downtown.", createdAt: getPastDate(6, 4, 5) },
            
            { senderId: me._id, receiverId: bob._id, text: "I went to the store and bought these new boots for the trip.", image: "https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=600&auto=format&fit=crop&q=60", createdAt: getPastDate(5, 8) },
            { senderId: bob._id, receiverId: me._id, text: "Those look sturdy. Good choice.", createdAt: getPastDate(5, 7) },
            { senderId: me._id, receiverId: bob._id, text: "Yeah, they are waterproof too.", createdAt: getPastDate(5, 6, 50) },
            { senderId: bob._id, receiverId: me._id, text: "Perfect for the mud trails near the cabin.", createdAt: getPastDate(5, 6, 40) },
            
            { senderId: me._id, receiverId: bob._id, text: "Are we going to do any fishing?", createdAt: getPastDate(4, 14) },
            { senderId: bob._id, receiverId: me._id, text: "Definitely. I got my gear ready.", image: "https://images.unsplash.com/photo-1508182314998-3bd49473002f?w=600&auto=format&fit=crop&q=60", createdAt: getPastDate(4, 13, 50) },
            { senderId: me._id, receiverId: bob._id, text: "Nice setup!", createdAt: getPastDate(4, 13, 40) },
            { senderId: bob._id, receiverId: me._id, text: "Thanks, took me a while to organize it all.", createdAt: getPastDate(4, 13, 30) },
            { senderId: me._id, receiverId: bob._id, text: "I'll just rent a rod when we get there.", createdAt: getPastDate(4, 13, 20) },

            { senderId: bob._id, receiverId: me._id, text: "Hey, what time are we leaving tomorrow?", createdAt: getPastDate(1, 12) },
            { senderId: me._id, receiverId: bob._id, text: "Let's aim for 7 AM so we skip the traffic.", createdAt: getPastDate(1, 11, 30) },
            { senderId: bob._id, receiverId: me._id, text: "Works for me. I'll pick you up.", createdAt: getPastDate(1, 11, 25) },
            { senderId: me._id, receiverId: bob._id, text: "Great. Should I bring the cooler?", createdAt: getPastDate(1, 11, 20) },
            { senderId: bob._id, receiverId: me._id, text: "Yes please, mine is broken.", createdAt: getPastDate(1, 11, 15) },
            
            { senderId: me._id, receiverId: bob._id, text: "I packed the car. Here's all the stuff.", image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600&auto=format&fit=crop&q=60", createdAt: getPastDate(0, 10, 0) },
            { senderId: bob._id, receiverId: me._id, text: "Looks like we're ready for an expedition 😂", createdAt: getPastDate(0, 9, 50) },
            { senderId: me._id, receiverId: bob._id, text: "Better overprepared than underprepared!", createdAt: getPastDate(0, 9, 45) },
            { senderId: bob._id, receiverId: me._id, text: "True that.", createdAt: getPastDate(0, 9, 40) },
            { senderId: bob._id, receiverId: me._id, text: "I'm about 5 minutes away.", createdAt: getPastDate(0, 0, 10) },
            { senderId: me._id, receiverId: bob._id, text: "Awesome, I'm waiting outside.", createdAt: getPastDate(0, 0, 5) },
            { senderId: bob._id, receiverId: me._id, text: "I see you!", createdAt: getPastDate(0, 0, 1) },
            { senderId: me._id, receiverId: bob._id, text: "Let's go!", createdAt: getPastDate(0, 0, 0) },
        ];
        
        // Bob also sends a sunset view, I send a selfie at the trailhead
        bobChat.splice(17, 0,
            { senderId: bob._id, receiverId: me._id, text: "Found this trail map for us.", image: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=600&auto=format&fit=crop&q=60", createdAt: getPastDate(4, 14, 30) },
            { senderId: me._id, receiverId: bob._id, text: "Looks like a long hike! I'm excited.", image: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=600&auto=format&fit=crop&q=60", createdAt: getPastDate(4, 14, 20) }
        );
        // Bob sends a sunset photo, me sends a campfire
        bobChat.push(
            { senderId: bob._id, receiverId: me._id, text: "Look at this sunset from the cabin!", image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&auto=format&fit=crop&q=60", createdAt: getPastDate(0, 0, 0) },
            { senderId: me._id, receiverId: bob._id, text: "Unreal. And the campfire was perfect.", image: "https://images.unsplash.com/photo-1510672981848-a1c4f1cb5ccf?w=600&auto=format&fit=crop&q=60", createdAt: getPastDate(0, 0, 0) }
        );

        // 2. Conversation with Charlie (Design Review) - expanded with more images both sides
        const charlieChat = [
            { senderId: charlie._id, receiverId: me._id, text: "Hi! Can you review the new UI mockups I sent yesterday?", createdAt: getPastDate(6, 4) },
            { senderId: me._id, receiverId: charlie._id, text: "Hey Charlie, I'm taking a look right now.", createdAt: getPastDate(6, 3) },
            { senderId: charlie._id, receiverId: me._id, text: "Here is the first screen — the landing page.", image: "https://images.unsplash.com/photo-1559028006-448665bd7c7f?w=600&auto=format&fit=crop&q=60", createdAt: getPastDate(6, 2, 55) },
            { senderId: me._id, receiverId: charlie._id, text: "I think the color scheme is great, but the padding is a bit off.", createdAt: getPastDate(6, 2, 50) },
            { senderId: me._id, receiverId: charlie._id, text: "Look at this screenshot of what I mean.", image: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=600&auto=format&fit=crop&q=60", createdAt: getPastDate(6, 2, 40) },
            { senderId: charlie._id, receiverId: me._id, text: "Ah yes, I see the issue. Let me fix it.", createdAt: getPastDate(5, 10) },
            { senderId: charlie._id, receiverId: me._id, text: "Here's the updated version with better padding.", image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=600&auto=format&fit=crop&q=60", createdAt: getPastDate(4, 10) },
            { senderId: me._id, receiverId: charlie._id, text: "Much better! What about the mobile view?", createdAt: getPastDate(4, 9, 45) },
            { senderId: charlie._id, receiverId: me._id, text: "Here's the mobile layout.", image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&auto=format&fit=crop&q=60", createdAt: getPastDate(3, 8) },
            { senderId: me._id, receiverId: charlie._id, text: "Looks clean! I made one small sketch of another idea.", image: "https://images.unsplash.com/photo-1541462608143-67571c6738dd?w=600&auto=format&fit=crop&q=60", createdAt: getPastDate(3, 7) },
            { senderId: charlie._id, receiverId: me._id, text: "Oh I like that idea! The bottom nav is cleaner.", createdAt: getPastDate(3, 6, 30) },
            { senderId: me._id, receiverId: charlie._id, text: "Approved on both. Ship it!", createdAt: getPastDate(1, 9) },
        ];

        // 3. Conversation with David - expanded with images both sides
        const davidChat = [
            { senderId: david._id, receiverId: me._id, text: "Hey, do you have the link to the API documentation?", createdAt: getPastDate(5, 2) },
            { senderId: me._id, receiverId: david._id, text: "Yes, it's on the internal wiki. Let me find it.", createdAt: getPastDate(5, 1, 55) },
            { senderId: me._id, receiverId: david._id, text: "Here you go: https://wiki.example.com/api", createdAt: getPastDate(5, 1, 50) },
            { senderId: david._id, receiverId: me._id, text: "Thanks a lot! Also, did you see the error on the dashboard?", image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=600&auto=format&fit=crop&q=60", createdAt: getPastDate(5, 1, 30) },
            { senderId: me._id, receiverId: david._id, text: "I see it. Let me check the server logs.", createdAt: getPastDate(5, 1, 25) },
            { senderId: me._id, receiverId: david._id, text: "Found the issue — look at this log output.", image: "https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=600&auto=format&fit=crop&q=60", createdAt: getPastDate(5, 1, 10) },
            { senderId: david._id, receiverId: me._id, text: "Ah that's the memory leak we suspected. Good catch!", createdAt: getPastDate(5, 0, 55) },
            { senderId: me._id, receiverId: david._id, text: "I'll push a fix shortly. Can you test after?", createdAt: getPastDate(5, 0, 50) },
            { senderId: david._id, receiverId: me._id, text: "Sure, I'll test on staging.", createdAt: getPastDate(5, 0, 40) },
            { senderId: david._id, receiverId: me._id, text: "Looks good after the fix! Here's the test passing.", image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&auto=format&fit=crop&q=60", createdAt: getPastDate(4, 3) },
            { senderId: me._id, receiverId: david._id, text: "Great, merging to main now.", createdAt: getPastDate(4, 2, 55) },
        ];

        // 4. Conversation with Eve - lots of images from both sides
        const eveChat = [
            { senderId: eve._id, receiverId: me._id, text: "Look at my new dog!", image: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=600&auto=format&fit=crop&q=60", createdAt: getPastDate(10, 6) },
            { senderId: me._id, receiverId: eve._id, text: "So cute!! What's his name?", createdAt: getPastDate(10, 5, 55) },
            { senderId: eve._id, receiverId: me._id, text: "His name is Max. He loves to play fetch.", createdAt: getPastDate(10, 5, 50) },
            { senderId: eve._id, receiverId: me._id, text: "Here he is at the park!", image: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&auto=format&fit=crop&q=60", createdAt: getPastDate(10, 5, 40) },
            { senderId: me._id, receiverId: eve._id, text: "Oh he looks so happy! I also got a pet recently.", image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&auto=format&fit=crop&q=60", createdAt: getPastDate(9, 5) },
            { senderId: eve._id, receiverId: me._id, text: "A CAT! I love cats. What's her name?", createdAt: getPastDate(9, 4, 30) },
            { senderId: me._id, receiverId: eve._id, text: "Her name is Luna.", createdAt: getPastDate(9, 4, 20) },
            { senderId: me._id, receiverId: eve._id, text: "She loves sleeping on my keyboard 😄", image: "https://images.unsplash.com/photo-1495360010541-f48722b34f7d?w=600&auto=format&fit=crop&q=60", createdAt: getPastDate(9, 4, 10) },
            { senderId: eve._id, receiverId: me._id, text: "Haha that's adorable. Max does the same with my shoes.", createdAt: getPastDate(8, 2) },
            { senderId: eve._id, receiverId: me._id, text: "We should have a pet playdate!", image: "https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=600&auto=format&fit=crop&q=60", createdAt: getPastDate(8, 1, 50) },
            { senderId: me._id, receiverId: eve._id, text: "100%! Luna would love that. Here's her playing with toys.", image: "https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=600&auto=format&fit=crop&q=60", createdAt: getPastDate(7, 10) },
            { senderId: eve._id, receiverId: me._id, text: "Too cute. Let's plan it for next weekend!", createdAt: getPastDate(7, 9, 50) },
        ];

        messages.push(...bobChat, ...charlieChat, ...davidChat, ...eveChat);

        // Ensure updatedAt is set to the same as createdAt
        messages.forEach(msg => {
            msg.updatedAt = msg.createdAt;
        });

        await Message.insertMany(messages);
        console.log(`Successfully created ${messages.length} messages spanning multiple days!`);

        process.exit(0);
    } catch (error) {
        console.error("Error seeding database:", error);
        process.exit(1);
    }
};

seedDatabase();
