import { model } from 'mongoose';
import { ProductSchema } from '../schemas/product-schema';

const Product = model('products', ProductSchema);

export class ProductModel {
  async findById(productId) {
    const product = await Product.findOne({ _id: productId });
    return product;
  }
  async findByName(productTitle) {
    const product = await Product.findOne({ productTitle });
    return product;
  }

  async create(productInfo) {
    const createdNewProduct = await Product.create(productInfo);
    return createdNewProduct;
  }

  async findAll() {
    const products = await Product.find({});
    return products;
  }
  async findAll(query) {
    const { sortKey, sortOrder, limit, offset } = query;
    const products = await Product.find({})
      .sort({ [sortKey]: sortOrder })
      .skip(limit * (offset - 1))
      .limit(limit);
    return products;
  }

  async findAllByCategory(categoryId) {
    const products = await Product.find({ categoryId });
    return products;
  }

  async update({ productId, update }) {
    const filter = { _id: productId };
    const option = { returnOriginal: false };

    const updatedProduct = await Product.findOneAndUpdate(
      filter,
      update,
      option,
    );
    return updatedProduct;
  }

  async delete(productId) {
    const product = await Product.findByIdAndDelete({ _id: productId });
    return product;
  }
  async deleteAll() {
    await Product.deleteMany({});
  }
  async insertAll(data) {
    await Product.insertMany(data);
  }
  async getProductsCount() {
    return await Product.countDocuments({});
  }
}

const productModel = new ProductModel();

export { productModel };
