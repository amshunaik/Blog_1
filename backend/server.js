const express=require('express')
const connectDb=require('./Db.js')
const itemModel=require('./Schema.js')
require('dotenv').config();
const { OpenAI } = require('openai');
//const redis=require('./redis.js');
const cors=require('cors');
const app=express();
app.use(express.json());
//app.use(cors())

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://blogpost1-nxy5.onrender.com');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});
const PORT=3005;
const openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY,
  });
connectDb();
const generateSummary = async (content) => {
   
    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [
              { role: 'system', content: 'You are an assistant that summarizes blog posts.' },
              { role: 'user', content: content },
            ],
        });
        const summary=response.choices[0].message.content.trim();
        return summary;
        
        } catch (error) {
          console.error('Error:', error);
        }
   
};

function generateCacheKey(req) {
  const baseUrl = req.path.replace(/^\/+|\/+$/g, '').replace(/\//g, ':');
  const params = req.query;
  const sortedParams = Object.keys(params)
      .sort()
      .map((key) => `${key}=${params[key]}`)
      .join('&');

  return sortedParams ? `${baseUrl}:${sortedParams}` : baseUrl;
}


  

app.get('/posts',async(req,res)=>{
    const key = generateCacheKey(req);
  
    const cachedProducts = await client.get(key);
    if (cachedProducts) {
        console.log('Cache hit');
        res.json(JSON.parse(cachedProducts));
        return;
    }
    console.log("cache miss")
  
    
    const items=await itemModel.find();
    if (items.length) {
      await client.set(key, JSON.stringify(items));
  }

    //res.json(items);

    //const cachedrecord=redis.get(items);
    res.json(items);
})
app.post('/posts',async(req,res)=>{
    const { title, content } = req.body;
    //console.log(data)
    const summary = await generateSummary(content);
   // console.log("summary : ",summary.param?"empty":"full");
    const newPost = new itemModel({ title, content,summary });
    await newPost.save();
    res.status(201).json(newPost);
    //res.send(items);
})
app.get('/posts/:id', async(req,res)=>{
    const id=req.params.id;
    console.log("id ed issj : ",id)
    try {
        const post = await itemModel.findById(req.params.id);
        if (!post) {
          return res.status(404).json({ error: 'Post not found' });
        }
        console.log(post)
        res.json(post);
        
      } catch (err) {
        res.status(500).json({ error: 'Error fetching the post' });
      }
    

})
app.put('/posts/:id', async (req, res) => {
    try {
      const { title, content } = req.body;
      const summary = await generateSummary(content);

      const updatedPost = await itemModel.findByIdAndUpdate(
        req.params.id,
        { title, content, summary },
        { new: true }
      );
      if (!updatedPost) {
        return res.status(404).json({ error: 'Post not found' });
      }
      res.json(updatedPost);
    } catch (err) {
      res.status(500).json({ error: 'Error updating post' });
    }
  });
  app.delete('/posts/:id', async (req, res) => {
      
    try {
        const deletedPost = await itemModel.findByIdAndDelete(req.params.id);
        if (!deletedPost) {
          return res.status(404).json({ error: 'Post not found' });
        }
        res.json({ message: 'Post deleted successfully' });
    } catch (err) {

        res.status(500).json({ error: 'Error deleting post' });
    }
  });

app.listen(PORT,()=>{
    console.log("app is running");
})
