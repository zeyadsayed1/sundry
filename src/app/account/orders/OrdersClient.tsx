"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiPackage, FiTruck, FiCheckCircle, FiClock, FiBox, FiArrowRight, FiLoader } from "react-icons/fi";
import { API_ENDPOINTS } from "@/app/lib/api";
import { getStoredToken, getStoredUser } from "@/app/lib/auth";
import type { Order } from "@/app/lib/types";

export default function OrdersClient() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      const token = await getStoredToken();
      const user = getStoredUser();

      if (!token || !user?.id) {
        setIsLoading(false);
        return;
      }

      try {
        // RouteMisr typically uses /api/v1/orders/user/:userId for user orders
        const res = await fetch(API_ENDPOINTS.orders.userOrders(user.id), {
          headers: { token },
        });
        
        const data = await res.json();
        
        if (res.ok) {
          // Sometimes it returns data directly, sometimes data.data
          const ordersList = Array.isArray(data) ? data : data.data || [];
          setOrders(ordersList);
        }
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <FiLoader size={40} className="animate-spin text-[#F0AA4C] mb-4" />
        <p className="text-[#8B879A] font-bold">Loading your orders...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-10 sm:p-16 text-center border border-[#EDEBF1] shadow-sm max-w-2xl mx-auto mt-10">
        <div className="w-24 h-24 bg-[#F7F6F9] rounded-full flex items-center justify-center mx-auto mb-6">
          <FiPackage size={40} className="text-[#8B879A]" />
        </div>
        <h2 className="text-2xl font-extrabold text-[#1E1C2B] mb-2">No Orders Yet</h2>
        <p className="text-[#8B879A] mb-8 text-sm">
          Looks like you haven't placed any orders yet. Start exploring our amazing collection!
        </p>
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#1E1C2B] text-white font-bold text-sm hover:bg-[#F0AA4C] hover:text-[#1E1C2B] transition-colors"
        >
          <span>Start Shopping</span>
          <FiArrowRight size={16} />
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-[#1E1C2B] tracking-tight">
          Order History
        </h1>
        <p className="text-sm text-[#8B879A] mt-1">
          Track, manage, and review your past purchases.
        </p>
      </div>

      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order.id || order._id} className="bg-white rounded-3xl border border-[#EDEBF1] shadow-sm overflow-hidden">
            {/* Order Header */}
            <div className="bg-[#F7F6F9] px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EDEBF1]">
              <div className="flex flex-wrap items-center gap-x-8 gap-y-2 text-sm">
                <div>
                  <p className="text-[#8B879A] text-xs font-bold uppercase tracking-wider mb-0.5">Order ID</p>
                  <p className="text-[#1E1C2B] font-bold">#{order.id || order._id}</p>
                </div>
                <div>
                  <p className="text-[#8B879A] text-xs font-bold uppercase tracking-wider mb-0.5">Date Placed</p>
                  <p className="text-[#1E1C2B] font-bold">
                    {new Date(order.createdAt).toLocaleDateString("en-US", {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-[#8B879A] text-xs font-bold uppercase tracking-wider mb-0.5">Total Amount</p>
                  <p className="text-[#1E1C2B] font-bold">{order.totalOrderPrice} EGP</p>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                {/* Payment Method Badge */}
                <span className="px-3 py-1.5 rounded-lg bg-white border border-[#EDEBF1] text-xs font-bold text-[#1E1C2B] uppercase">
                  {order.paymentMethodType === 'card' ? 'Online Card' : 'Cash'}
                </span>
                
                {/* Status Badge */}
                <div className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 text-xs font-bold uppercase ${
                  order.isDelivered 
                    ? "bg-[#EAF8F1] text-[#3FA772] border border-[#BCE4CD]" 
                    : "bg-[#FFF4E6] text-[#F0AA4C] border border-[#FDE3B9]"
                }`}>
                  {order.isDelivered ? <FiCheckCircle size={14} /> : <FiTruck size={14} />}
                  <span>{order.isDelivered ? "Delivered" : "In Transit"}</span>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="p-6">
              <div className="space-y-4">
                {order.cartItems?.map((item: any, idx: number) => (
                  <div key={idx} className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-xl bg-[#F7F6F9] border border-[#EDEBF1] overflow-hidden relative shrink-0">
                      <Image
                        src={item.product?.imageCover || '/placeholder.png'}
                        alt={item.product?.title || 'Product'}
                        fill
                        className="object-contain p-2"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-[#1E1C2B] truncate">
                        {item.product?.title || 'Product Item'}
                      </h4>
                      <p className="text-xs font-semibold text-[#8B879A] mt-0.5">
                        Qty: {item.count} <span className="mx-1">•</span> {item.price} EGP
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
