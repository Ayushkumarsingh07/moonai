import { clerkClient } from "@clerk/express";

export const auth= async (req, res, next)=> {
try {
    const {userId, has} = await req.auth();
    const hasPremiumPlan = await has({plan: 'moon_pro'})

    const user = await clerkClient.users.getUser(userId);

    if (!hasPremiumPlan) {
        req.free_usage = user.privateMetadata.free_usage || 0;
    } else {
        req.free_usage = 0;
    }
    req.plan = hasPremiumPlan ? 'MoonPro' : 'Free';
    next()
} catch (error) {
    res.json({success: false, message: error.message})
    
}
}