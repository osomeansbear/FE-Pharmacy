"use client";

// Import Component và Type từ file CartItem bên trên
import CartItem, {
  CartItemData,
} from "@/components/desktop/user/cart/CartItem";
import { Button } from "@/components/ui/button";

// Khai báo mảng dữ liệu (Array)
const cartItems: CartItemData[] = [
  {
    id: 1,
    imgUrl:
      "https://cdn.nhathuoclongchau.com.vn/unsafe/640x0/filters:quality(90):format(webp)/DSC_04874_6c29236c37.jpg",
    brand: "Nike",
    name: "Nike Air Max 270 React",
    price: 299.43,
    quantity: 2,
  },
  {
    id: 2,
    imgUrl:
      "https://cdn.nhathuoclongchau.com.vn/unsafe/640x0/filters:quality(90):format(webp)/DSC_04874_6c29236c37.jpg",
    brand: "Adidas",
    name: "Ultraboost 22 Running Shoes",
    price: 180.0,
    quantity: 1,
  },
  {
    id: 3,
    imgUrl:
      "https://cdn.nhathuoclongchau.com.vn/unsafe/640x0/filters:quality(90):format(webp)/DSC_04874_6c29236c37.jpg",
    brand: "Apple",
    name: "Apple Watch Series 9",
    price: 399.99,
    quantity: 1,
  },
  {
    id: 4,
    imgUrl:
      "https://cdn.nhathuoclongchau.com.vn/unsafe/640x0/filters:quality(90):format(webp)/DSC_04874_6c29236c37.jpg",
    brand: "Zara",
    name: "Leather Crossbody Bag",
    price: 49.9,
    quantity: 3,
  },
];

export default function CartPage() {
  return (
    <div className="px-16 py-8">
      <h1 className="text-2xl font-bold mb-4">My Cart</h1>

      <div className="flex flex-col gap-2">
        {cartItems.map((singleItem) => (
          // Truyền từng object con vào prop "item"
          <CartItem key={singleItem.id} item={singleItem} />
        ))}
      </div>

      <div className="flex flex-col border border-primary rounded-2xl mt-4 gap-6 px-8 py-8 bg-white">
        <span className="text-xl font-bold text-primary">Bag Total</span>

        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center text-sm font-bold">
            <span className=" text-muted/80 ">Subtotal</span>
            <div>0.00</div>
          </div>
          <div className="flex justify-between items-center text-sm font-bold">
            <span className="text-muted/80 ">Shipping</span>
            <div className="text-emerald-700/90">Free</div>
          </div>
        </div>

        <div className="flex justify-between items-center text-2xl font-bold border-t-2 border-black py-4">
          <span>Total</span>
          <div className="text-emerald-900">0.00</div>
        </div>

        <Button className="bg-success justify-center text-secondary text-2xl font-bold rounded-full py-8  ">
          Place Order
        </Button>
      </div>
    </div>
  );
}
