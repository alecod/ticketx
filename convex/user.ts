import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const updateUser  = mutation({
    args: {
        userId: v.string(),
        email: v.string(),
        name: v.string()
    },
    handler: async (ctx, {email, name, userId}) => {

        const existingUser = await ctx.db.query("users").withIndex("by_user_id", (q) => q.eq("userId", userId)).first()

        if(existingUser) {
            await ctx.db.patch(existingUser._id, {
                email,
                name
            })
            return existingUser._id
        }
        
        const newUserId = await ctx.db.insert("users", {
            userId,
            email,
            name, 
            stripeConnectId: undefined
        })

        return newUserId
    }
})
