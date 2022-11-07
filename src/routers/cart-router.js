import { Router } from 'express';
import is from '@sindresorhus/is';
// 폴더에서 import하면, 자동으로 폴더의 index.js에서 가져옴
import { isAdmin, loginRequired } from '../middlewares';
import { cartService } from '../services';

const cartRouter = Router();

//전체 장바구니 조회 API - GET /api/carts
cartRouter.get('/cart', loginRequired, async (req, res, next) => {
  try {
    const { currentUserId } = req;
    console.log(currentUserId);
    const carts = await cartService.getCartByUserId(currentUserId);
    res.status(200).json(carts);
  } catch (error) {
    next(error);
  }
});
//장바구니 추가 API - POST /cart
cartRouter.post('/cart', loginRequired, async (req, res, next) => {
  try {
    const { currentUserId } = req;
    const newCart = await cartService.addCart({
      orderSheets: [],
      userId: currentUserId,
    });
    // 추가된 장바구니 db 데이터를 프론트에 다시 보내줌
    // 물론 프론트에서 안 쓸 수도 있지만, 편의상 일단 보내 줌
    res.status(201).json({ newCart });
  } catch (error) {
    next(error);
  }
});

//장바구니에 추가 API - PATCH /cart/{cartId}
cartRouter.patch('/cart', loginRequired, async (req, res, next) => {
  try {
    const { currentUserId } = req;
    const { productId, quantity } = req.body;
    if (!productId) {
      throw new Error('productId 가 비어있어요');
    }
    if (!quantity) {
      throw new Error('quantity 가 비어있어요');
    }

    const orderSheets = {
      productId,
      quantity,
    };
    const toUpdate = {
      ...(orderSheets && { orderSheets }),
    };
    const updatedCart = await cartService.updateCartByUserId(
      currentUserId,
      toUpdate,
    );
    res.status(200).json(updatedCart);
  } catch (error) {
    next(error);
  }
});

//장바구니 삭제 API - DELETE /cart/{cartId}
cartRouter.delete('/cart', loginRequired, async (req, res, next) => {
  try {
    const { productId } = req.body;
    const { currentUserId } = req;
    if (productId) {
      const deletedCart = await cartService.deleteCart(
        currentUserId,
        productId,
      );
      res.status(200).json(deletedCart);
      return;
    }
    const deletedCart = await cartService.deleteCartAll(currentUserId);
    res.status(200).json(deletedCart);
    return;
  } catch (error) {
    next(error);
  }
});
export { cartRouter };
