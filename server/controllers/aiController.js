import { clerkClient } from "@clerk/express";
import OpenAI from "openai";
import axios from "axios";
import FormData from "form-data";
import {v2 as cloudinary} from 'cloudinary'
import sql from '../configs/db.js';
import fs from 'fs';
// Import the parser implementation directly. The package entry point runs its
// bundled test fixture when loaded from an ES module environment.
import pdf from 'pdf-parse/lib/pdf-parse.js';


const AI = new OpenAI({
    apiKey: process.env.GEMINI_API_KEY,
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
});

export const generateBlogTitles = async (req, res) => {
    try {
        const { userId } = req.auth();
        const {prompt} = req.body;
        const fullPrompt = `Generate 10 high-quality blog titles for the topic: "${prompt}".\n- Make them engaging and SEO-friendly\n- Return only bullet points\n- No explanations`;
        const plan = req.plan;
        const free_usage = req.free_usage;

        const FREE_LIMIT = 10;
        if (plan !== 'MoonPro' && free_usage >= FREE_LIMIT) {
            return res.json({success: false, message: 'You have exhausted your free usage. Please upgrade to MoonPro to continue using the service.'})
        }

        const response = await AI.chat.completions.create({
    model: "gemini-3-flash-preview",
    messages: [{role: "user", content: fullPrompt}],
    temperature: 0.7,
    max_tokens:300,
});

const content = response.choices[0].message.content

await sql`INSERT INTO creations (user_Id, prompt, content, type) VALUES (${userId}, ${prompt}, ${content}, 'blog_title')`;

if(plan !== 'MoonPro') {
    await clerkClient.users.updateUserMetadata(userId, {
        privateMetadata: {
            free_usage: free_usage + 1
        }
    })
}

res.json({success: true, content})


    } catch (error) {
        console.log(error.message)
        res.json({success: false, message: error.message})
    }
}

export const generateArticle = async (req, res) => {
    try {
        const { userId } = req.auth();
        const {prompt, length} = req.body;
        const plan = req.plan;
        const free_usage = req.free_usage;

        const FREE_LIMIT = 10;
        if (plan !== 'MoonPro' && free_usage >= FREE_LIMIT) {
            return res.json({success: false, message: 'You have exhausted your free usage. Please upgrade to MoonPro to continue using the service.'})
        }

        const response = await AI.chat.completions.create({
    model: "gemini-3-flash-preview",
    messages: [
        {
            role: "user",
            content: prompt,
        },
    ],
    temperature: 0.7,
    max_tokens: length,
});

const content = response.choices[0].message.content

await sql`INSERT INTO creations (user_Id, prompt, content, type) VALUES (${userId}, ${prompt}, ${content}, 'article')`;

if(plan !== 'MoonPro') {
    await clerkClient.users.updateUserMetadata(userId, {
        privateMetadata: {
            free_usage: free_usage + 1
        }
    })
}

res.json({success: true, content})


    } catch (error) {
        console.log(error.message)
        res.json({success: false, message: error.message})
    }
}

export const generateImage = async (req, res) => {
    try {
        const { userId } = req.auth();
        const {prompt, publish} = req.body;
        const plan = req.plan;

        if (plan !== 'MoonPro') {
            return res.json({success: false, message: 'This feature is available for MoonPro users only. Please upgrade to access this feature.'})
        }

        const formData = new FormData()
        formData.append('prompt', prompt)
        const { data } = await axios.post('https://clipdrop-api.co/text-to-image/v1', formData, {
              headers: {
                ...formData.getHeaders(),
                'x-api-key': process.env.CLIPDROP_API_KEY,
              },
              responseType: "arraybuffer",
        })

        const base64Image = `data:image/jpeg;base64,${Buffer.from(data, 'binary').toString('base64')}`;

        const { secure_url } = await cloudinary.uploader.upload(base64Image)

await sql`INSERT INTO creations (user_Id, prompt, content, type, publish) VALUES (${userId}, ${prompt}, ${secure_url}, 'image', ${publish ?? false})`;

res.json({success: true, content: secure_url})


    } catch (error) {
        console.log(error.message)
        res.json({success: false, message: error.message})
    }
}

export const removeImageBackground = async (req, res) => {
    try {
        const { userId } = req.auth();
        const image = req.file;
        const plan = req.plan;

        if (plan !== 'MoonPro') {
            return res.json({success: false, message: 'This feature is available for MoonPro users only. Please upgrade to access this feature.'})
        }

        const { secure_url } = await cloudinary.uploader.upload(image.Buffer, {
            transformation: [
                {
                    effect: "background_removal",
                    background_removal: 'remove_the_background'
                }
            ]
        })

await sql`INSERT INTO creations (user_Id, prompt, content, type) VALUES (${userId}, 'remove background from image' , ${secure_url}, 'image')`;

res.json({success: true, content: secure_url})

    } catch (error) {
        console.log(error.message)
        res.json({success: false, message: error.message})
    }
}

export const removeImageObject = async (req, res) => {
    try {
        const { userId } = req.auth();
        const { object } = req.body;
        const image = req.file;
        const plan = req.plan;

        if (plan !== 'MoonPro') {
            return res.json({success: false, message: 'This feature is available for MoonPro users only. Please upgrade to access this feature.'})
        }

        const { public_id } = await cloudinary.uploader.upload(image.Buffer)

        const imageUrl = cloudinary.url(public_id, {
            transformation:[{effect: `gen_remove:${object}`}],
            resource_type:'image'
        })

await sql`INSERT INTO creations (user_Id, prompt, content, type) VALUES (${userId}, ${`Removed ${object} from image`} , ${imageUrl}, 'image')`;

res.json({success: true, content: imageUrl})

    } catch (error) {
        console.log(error.message)
        res.json({success: false, message: error.message})
    }
}

export const reviewResume = async (req, res) => {
    try {
        const { userId } = req.auth();
        const resume = req.file;
        const plan = req.plan;

        if (plan !== 'MoonPro') {
            return res.json({success: false, message: 'This feature is available for MoonPro users only. Please upgrade to access this feature.'})
        }

       if(resume.size > 5 * 1024 * 1024) {
        return res.json({success: false, message: 'Resume size should be less than 5MB'})
       }

       const dataBuffer = fs.readFileSync(resume.Buffer);

       const pdfData = await pdf(resume.Buffer);

       const prompt = `Review the following resume and provide feedback on how to improve it. Highlight any areas that need improvement and suggest specific changes. Resume content: Resume Content:\n\n${pdfData.text}`

       const response = await AI.chat.completions.create({
             model: "gemini-3-flash-preview",
             messages: [{role: "user",content: prompt,},],
             temperature: 0.7,
             max_tokens:1000,
});

const content = response.choices[0].message.content

await sql`INSERT INTO creations (user_Id, prompt, content, type) VALUES (${userId}, 'Review the uploaded resume' , ${content}, 'resume-review')`;

res.json({success: true, content})

    } catch (error) {
        console.log(error.message)
        res.json({success: false, message: error.message})
    }
}
