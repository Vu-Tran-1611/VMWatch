<?php

namespace App\Http\Controllers;

use App\Http\Resources\OrderResource;
use App\Mail\OrderConfirmationMail;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;

class OrderController extends Controller
{
    /**
     * Create a new controller instance.
     */
    public function __construct()
    {
        $this->authorizeResource(Order::class, 'order');
    }
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {

        $user = Auth::user();
        $orders = Order::where('user_id', $user->id)->paginate(5);
        return OrderResource::collection($orders);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $user = Auth::user();
        // Create a new order
        $order = Order::create([
            'user_id' => $user->id,
            'transaction_id' => $request->input('transaction_id'),
            'total_amount' => $request->input('total'),
            'phone_number' => $request->input('customerInfo')['phoneNumber'],
            'payment_method' => "stripe",
            'shipping_address' => $request->input('customerInfo')['address'],
            'shipping_city' => $request->input('customerInfo')['city'],
            'shipping_state' => $request->input('customerInfo')['state'],
            'shipping_zip' => $request->input('customerInfo')['zipCode'],
            'shipping_country' => "United States",
        ]);
        // Create order items
        foreach ($request->input('cart') as $item) {
            $order->items()->create([
                'watch_id' => $item['id'],
                'quantity' => $item['quantity'],
                'price' => $item['price'],
            ]);
        }

        // Send an email to the user (wrapped in try-catch to prevent order failure)
        try {
            Mail::to($user->email)->send(new OrderConfirmationMail($order->load('user')));
        } catch (\Exception $e) {
            // Log the error but don't fail the order
            \Log::error('Failed to send order confirmation email: ' . $e->getMessage());
        }

        // Clear the cart
        try {
            $user->clearCart();
        } catch (\Exception $e) {
            \Log::error('Failed to clear cart: ' . $e->getMessage());
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Order created successfully',
            'order' => $order,
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Order $order)
    {
        return new OrderResource($order->load(['items.watch.watchThumb', 'user']));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Order $order)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Order $order)
    {
        //
    }
}
