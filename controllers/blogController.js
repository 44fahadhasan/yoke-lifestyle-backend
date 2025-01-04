// Internal imports
const Blog = require("../models/Blog");

/**
 * @route   GET /api/blogs
 * @desc    Retrieve all blogs
 * @access  Public
 */
exports.getAllBlogs = async (req, res) => {
  try {
    // destructure query parameters with default values
    const { page = 0, size = 6 } = req.query;

    // pagination settings
    const perPageBlogs = parseInt(size);
    const currentPage = parseInt(page);
    const skipBlogs = currentPage * perPageBlogs;

    // the query object
    const query = {};

    // count total blogs matching the query
    const totalBlogsNumber = await Blog.countDocuments(query);

    // find blogs with pagination
    const blogs = await Blog.find(query).skip(skipBlogs).limit(perPageBlogs);

    res.status(200).json({
      success: true,
      message: "Blogs fetch successfully",
      totalBlogs: totalBlogsNumber,
      data: blogs,
    });
  } catch (error) {
    console.log({ error });
    res.status(500).json({ success: false, message: "Failed to fetch blogs" });
  }
};

/**
 * @route   GET /api/blogs/details/:id
 * @desc    Retrieve a single blog details by ID
 * @access  Public
 */
exports.getBlogDetailstById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res
        .status(404)
        .json({ success: false, message: "Blog not found" });
    }

    res.status(200).json({
      success: true,
      message: "Blog fetch successfully",
      data: blog,
    });
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res
        .status(400)
        .json({ success: false, message: "Invalid blog ID format" });
    }

    res.status(500).json({
      success: false,
      message: "Failed to fetch blog",
    });
  }
};

/**
 * @route   POST /api/blogs
 * @desc    Create a new blog
 * @access  Private(admin)
 */
exports.createBlog = async (req, res) => {
  try {
    const blog = await Blog.create(req.body);

    res.status(201).json({
      success: true,
      message: "Blog created successfully",
      data: blog,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to create blog" });
  }
};

/**
 * @route   PUT /api/blogs/:id
 * @desc    Update an existing blog by ID
 * @access   Private(admin)
 */
exports.updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // Return the updated document
      runValidators: true, // Validate before updating
    });

    if (!blog) {
      return res
        .status(404)
        .json({ success: false, message: "Blog not found" });
    }

    res.status(200).json({
      success: true,
      message: "Blog updated successfully",
      data: blog,
    });
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res
        .status(400)
        .json({ success: false, message: "Invalid blog ID format" });
    }

    res.status(500).json({ success: false, message: "Failed to update blog" });
  }
};

/**
 * @route   DELETE /api/blogs/:id
 * @desc    Delete an existing blog by ID
 * @access  Public
 */
exports.deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);

    if (!blog) {
      return res
        .status(404)
        .json({ success: false, message: "Blog not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Blog deleted successfully" });
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res
        .status(400)
        .json({ success: false, message: "Invalid blog ID format" });
    }

    res.status(500).json({ success: false, message: "Failed to delete blog" });
  }
};
