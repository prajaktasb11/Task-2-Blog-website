// app.js
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 3000;
const Post = require('./models/post');

mongoose.connect('mongodb://localhost/blog-website', { useNewUrlParser: true, useUnifiedTopology: true });

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Fetch all posts
app.get('/', async (req, res) => {
  try {
    const posts = await Post.find();
    res.render('index', { posts });
  } catch (err) {
    console.error(err);
    res.send('Error fetching posts');
  }
});

// Fetch a single post by ID
app.get('/posts/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).send('Post not found');
    }
    res.render('post', { post });
  } catch (err) {
    console.error(err);
    res.send('Error fetching post');
  }
});

// Display the form for creating a new post
app.get('/new', (req, res) => {
  res.render('new');
});

// Handle post submission
app.post('/new', async (req, res) => {
  const { title, content } = req.body;
  try {
    await Post.create({ title, content });
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.send('Error creating post');
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
