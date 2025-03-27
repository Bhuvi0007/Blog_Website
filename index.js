import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;
var title = "";
var author = "";
var blog = "";
const blogs = [];


const now = new Date();
const day = now.getDate();
const month = now.getMonth() + 1; 
const year = now.getFullYear();
const formattedDate = `${day}/${month}/${year}`;

const defaultBlog = {
    mytitle: "Blog Breeze",
    myauthor: "Bhuvan M",
    myblog: "At Blog Breeze, we aim to empower content creators and readers alike with a user-friendly, dynamic blogging platform. Whether you're here to share your thoughts, explore expert reviews, or engage in community discussions, Blog Breeze has it all. Our platform, built with EJS, Node.js, and Express, makes it easy to add, edit, and manage posts, ensuring a seamless experience.",
    date: "12/9/2024"
};

if (blogs.length === 0) {
    blogs.push(defaultBlog);
}

let currentNumber = 1;
function displayNumber() {
    currentNumber = currentNumber+1;
    return currentNumber;
}

app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: true }));

//custom middleware
app.use((req, res, next)=>{
    title = req.body["title"];
    author = req.body["author"];
    blog = req.body["blog"];
    next();
});


app.get("/", (req, res)=>{
    res.render("index.ejs", { blogs: blogs });
});


app.get("/blog_post", (req, res)=>{
    res.render("blog_post.ejs");
});


app.get("/about", (req, res)=>{
    res.render("about.ejs");
  });


app.get("/contact", (req, res)=>{
    res.render("contact.ejs");
});


app.get("/blog_create", (req, res)=>{
    res.render("blog_create.ejs");
});


app.post('/submit', (req, res) => {
    const { id, title, author, blog } = req.body;
    if (id) {
        // Update existing blog post
        const index = parseInt(id, 10);
        if (blogs[index]) {
            blogs[index] = { mytitle: title, myauthor: author, myblog: blog, date: formattedDate };
            res.redirect(`/blog_post/${index}`);
        } else {
            res.status(404).send('Blog post not found');
        }
    } else {
        // Handle new blog post creation
        blogs.push({ mytitle: title, myauthor: author, myblog: blog, date: formattedDate });
        res.redirect("/");
    }
});



app.get('/blog_post/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);

    const blogPost = blogs[id];

    if (blogPost) {
        res.render("blog_post.ejs", {
            mytitle: blogPost.mytitle,
            myauthor: blogPost.myauthor,
            date: blogPost.date,
            myblog: blogPost.myblog,
            index: id
        });
    } else {
        res.status(404).send('Blog post not found');
    }
});




app.get('/edit_blog/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    const blogPost = blogs[id];

    if (blogPost) {
        res.render("edit_blog.ejs", {
            mytitle: blogPost.mytitle,
            myauthor: blogPost.myauthor,
            date: blogPost.date,
            myblog: blogPost.myblog,
            index: id 
        });
    } else {
        res.status(404).send('Blog post not found');
    }
});


app.get('/delete_blog/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);

    if (blogs[id]) {
        blogs.splice(id, 1); 
        res.redirect('/'); 
    } else {
        res.status(404).send('Blog post not found');
    }
});




app.post("/submitted", (req, res)=>{
    const name = req.body.name;
    const email = req.body.email;
    res.render("contact.ejs", {message : `Thank you, ${name}, for contacting us! We will respond to ${email} soon.`});
    
});


app.listen(port, ()=>{
    console.log(`Listening to the port ${port}`);
});