const mongoose = require("mongoose");
const Category = require("../models/Category");
const getId = (id) => { if (!mongoose.isValidObjectId(id)) throw Object.assign(new Error("Invalid category id"), { status: 400 }); return id; };
const list = async ({ isActive, includeInactive }) => { const filter = includeInactive ? {} : { isActive: true }; if (includeInactive && isActive !== undefined) filter.isActive = isActive; return Category.find(filter).select("name description isActive createdAt updatedAt").sort({ name: 1, createdAt: 1 }); };
const getById = async (id, includeInactive) => { const category = await Category.findOne({ _id: getId(id), ...(includeInactive ? {} : { isActive: true }) }).select("name description isActive createdAt updatedAt"); if (!category) throw Object.assign(new Error("Category not found"), { status: 404 }); return category; };
const create = (data) => Category.create(data);
const update = async (id, data) => { const category = await Category.findByIdAndUpdate(getId(id), data, { new: true, runValidators: true }).select("name description isActive createdAt updatedAt"); if (!category) throw Object.assign(new Error("Category not found"), { status: 404 }); return category; };
module.exports = { list, getById, create, update };
