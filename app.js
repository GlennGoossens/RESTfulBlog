var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var methodOverride = require("method-override");
var expressSanitizer = require("express-sanitizer");

mongoose.connect("mongodb://localhost/restful_blog_app", {useMongoClient: true});

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));

var blogSchema = mongoose.Schema({
  title: String,
  image: String,
  body: String,
  created: {
    type: Date,
    default: Date.now
  }
});

var Blog = mongoose.model("Blog", blogSchema);

/*
Blog.create({
  title:"test blog",
  image: "https://images.unsplash.com/photo-1503256207526-0d5d80fa2f47?w=2133&ixid=dW5zcGxhc2guY29tOzs7Ozs%3D",
  body: "Hello this is a blog post"
});
*/
app.get("/", function(req, res) {
  res.redirect("/blogs");
})

app.get("/blogs", function(req, res) {
  Blog.find({}, function(err, blog) {
    if (err) {
      console.log(err);
    } else {
      res.render("index", {blogs: blog});
    }
  });
});

app.get("/blogs/new",function(req,res){
  res.render("new");
});

app.post("/blogs",function(req,res){
  req.body.blog.body = req.sanitize(req.body.blog.body);
  Blog.create(req.body.blog,function(err,newBlog){
    if(err){
      console.log(err);
      res.render("new");
    }else{
      console.log("creation completed");
      res.redirect("/blogs");
    }
  });
});

app.get("/blogs/:id",function(req,res){
  Blog.findById(req.params.id,function(err,found){
    if(err){
      redirect("/blogs");
    }else{
      res.render("show",{blog:found});
    }
  });
});

app.get("/blogs/:id/edit",function(req,res){
  Blog.findById(req.params.id,function(err,found){
    if(err){
      res.redirect("/blogs");
    }else{
      res.render("edit",{blog:found});
    }
  });
});

app.put("/blogs/:id",function(req,res){
  req.body.blog.body = req.sanitize(req.body.blog.body);
  Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,blog){
    if(err){
      console.log(err);
      res.redirect("/");
    }else{
      res.redirect("/blogs/" + req.params.id);
    }
  });
});

app.delete("/blogs/:id",function(req,res){
  Blog.findByIdAndRemove(req.params.id,function(err){
    if(err){
      res.redirect("/blogs");
    }else{
      res.redirect("/blogs");
    }
  });
});

app.listen(3000, function() {
  console.log("server is started");
});
