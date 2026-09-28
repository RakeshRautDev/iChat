import { Router } from "express";
import userModel from "../models/user.model.js";
import { verifyWebhook } from "@clerk/express/webhooks";

const router = Router();

router.post("/", async (req, res) => {
    const signingSecret = process.env.CLERK_WEBHOOK;

    if (!signingSecret) {
        return res.status(503).json({
            message: "Webhook secret is not provided"
        });
    }

    try {
        const evt = await verifyWebhook(req, {
            signingSecret
        });

        const { type, data } = evt;

        if (type === "user.created") {
            const fullName = `${data.first_name || ""} ${data.last_name || ""}`.trim();

            await userModel.create({
                clerkId: data.id,
                email: data.email_addresses[0].email_address,
                fullName,
                profilePic: data.image_url || ""
            });
        }

        else if (type === "user.updated") {
            const fullName = `${data.first_name || ""} ${data.last_name || ""}`.trim();

            await userModel.findOneAndUpdate(
                { clerkId: data.id },
                {
                    email: data.email_addresses[0].email_address,
                    fullName,
                    profilePic: data.image_url || ""
                },
                { new: true }
            );
        }

        else if (type === "user.deleted") {
            await userModel.findOneAndDelete({
                clerkId: data.id
            });
        }

        return res.status(200).json({
            success: true
        });

    } catch (error) {
        console.error("Clerk webhook error:", error);

        return res.status(400).json({
            message: "Invalid webhook"
        });
    }
});

export default router;