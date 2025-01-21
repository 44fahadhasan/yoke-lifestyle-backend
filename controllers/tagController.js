// External imports
const mongoose = require("mongoose");

// Internal imports
const Tag = require("../models/Tag");

/**
 * @route   GET /api/tags/parent
 * @desc    Retrieve all parent tags
 * @access  Public
 */
exports.getAllParentTags = async (req, res) => {
  try {
    const { featured } = req.query;

    const query = {
      parent_tag: null,
      status: "published",
    };

    // filter by featured tag
    if (featured) {
      query.featured_tag = { $regex: featured, $options: "i" };
    }

    const tags = await Tag.find(query)
      .select("-updatedAt -createdAt -email -status")
      .sort({ priority_number: -1 });

    res.status(200).json({
      success: true,
      message: "Parent tags fetch successfully",
      data: tags,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch parent tags" });
  }
};

/**
 * @route   GET /api/tags/:parentId/children
 * @desc    Retrieve all children tags of any parent tag
 * @access  Public
 */
exports.getAllChildrenTags = async (req, res) => {
  try {
    const { featured } = req.query;
    const { parentId } = req.params;

    // validate parentId
    if (!mongoose.Types.ObjectId.isValid(parentId)) {
      return res.status(500).json({
        success: false,
        message: "Invalid parent tag id format",
      });
    }

    const query = {
      parent_tag: parentId,
      status: "published",
    };

    // filter by featured tag
    if (featured) {
      query.featured_tag = { $regex: featured, $options: "i" };
    }

    const tags = await Tag.find(query)
      .select("-updatedAt -createdAt -email -status")
      .sort({ priority_number: -1 });

    res.status(200).json({
      success: true,
      message: "Children tags fetch successfully",
      data: tags,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch children tags" });
  }
};

/**
 * @route   GET /api/tags
 * @desc    Retrieve all tags
 * @access  Private(admin)
 */
exports.getAllTags = async (req, res) => {
  try {
    // destructure query parameters with default values
    const { search, featured, status, sort, page = 0, size = 6 } = req.query;

    // pagination settings
    const perPageTags = parseInt(size);
    const currentPage = parseInt(page);
    const skipTags = currentPage * perPageTags;

    // the query object
    const query = {};

    // search by search text (category name or slug/path)
    if (search) {
      query.$or = [
        { tag_name: { $regex: search, $options: "i" } },
        { slug_name: { $regex: search, $options: "i" } },
      ];
    }

    // filter by featured tag
    if (featured) {
      query.featured_tag = { $regex: featured, $options: "i" };
    }

    // filter by status
    if (status) {
      query.status = { $regex: status, $options: "i" };
    }

    // the sort object
    const sortOptions = { createdAt: -1 };

    if (sort) {
      if (sort.toLowerCase() === "newest") {
        sortOptions.createdAt = -1;
      }
      if (sort.toLowerCase() === "oldest") {
        sortOptions.createdAt = 1;
      }
    }

    // find tags with pagination
    const tags = await Tag.find(query)
      .select(
        "_id tag_name slug_name priority_number status featured_tag createdAt"
      )
      .sort(sortOptions)
      .skip(skipTags)
      .limit(perPageTags);

    // count total tags matching the query
    const totalTagsNumber = await Tag.countDocuments(query);

    res.status(200).json({
      success: true,
      message: "Tags fetch successfully",
      totalTags: totalTagsNumber,
      data: tags,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch tags" });
  }
};

/**
 * @route   GET /api/tags/list
 * @desc    Retrieve all tags list
 * @access  Private(admin)
 */
exports.getAllTagsList = async (req, res) => {
  try {
    const tags_list = await Tag.find({
      status: "published",
    })
      .select("_id tag_name")
      .sort({ createdAt: -1 });

    // modify data
    const modified_tags_list = tags_list?.map(({ tag_name, _id }) => ({
      label: tag_name,
      value: tag_name,
      _id,
    }));

    res.status(200).json({
      success: true,
      message: "Tags list fetch successfully",
      data: [
        {
          label: "No Parent Tag",
          value: null,
          _id: null,
        },
        ...modified_tags_list,
      ],
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch tags list" });
  }
};

/**
 * @route   GET /api/tags/details/:id
 * @desc    Retrieve a single tag details by ID
 * @access  Private(admin)
 */
exports.getTagDetailstById = async (req, res) => {
  try {
    const tag = await Tag.findById(req.params.id);

    if (!tag) {
      return res.status(404).json({ success: false, message: "Tag not found" });
    }

    res.status(200).json({
      success: true,
      message: "Tag fetch successfully",
      data: tag,
    });
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res
        .status(400)
        .json({ success: false, message: "Invalid tag ID format" });
    }

    res.status(500).json({
      success: false,
      message: "Failed to fetch tag",
    });
  }
};

/**
 * @route   POST /api/tags
 * @desc    Create a new tag
 * @access  Private(admin)
 */
exports.createTag = async (req, res) => {
  try {
    const tag = await Tag.create(req.body);

    res.status(201).json({
      success: true,
      message: "Tag create successfully",
      data: tag,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to create tag", error });
  }
};

/**
 * @route   PUT /api/tags/:id
 * @desc    Update an existing tag by ID
 * @access  Private(admin)
 */
exports.updateTag = async (req, res) => {
  try {
    const tag = await Tag.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // Return the updated document
      runValidators: true, // Validate before updating
    });

    if (!tag) {
      return res.status(404).json({ success: false, message: "Tag not found" });
    }

    res.status(200).json({
      success: true,
      message: "Tag updated successfully",
      data: tag,
    });
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res
        .status(400)
        .json({ success: false, message: "Invalid tag ID format" });
    }

    res.status(500).json({ success: false, message: "Failed to update tag" });
  }
};

/**
 * @route   DELETE /api/tags/:id
 * @desc    Delete an existing tag by ID
 * @access  Private(admin)
 */
exports.deleteTag = async (req, res) => {
  try {
    const tag = await Tag.findByIdAndDelete(req.params.id);

    if (!tag) {
      return res.status(404).json({ success: false, message: "Tag not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Tag deleted successfully" });
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res
        .status(400)
        .json({ success: false, message: "Invalid tag ID format" });
    }

    res.status(500).json({ success: false, message: "Failed to delete tag" });
  }
};
