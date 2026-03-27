<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Stripe\Stripe;
use Stripe\PaymentIntent;

class PaymentController extends Controller
{
    public function makePayment(Request $request)
    {
        Stripe::setApiKey(env('STRIPE_SECRET_KEY'));

        // Calculate total from all cart items
        $cart = $request->input('cart');
        $total = 0;
        foreach ($cart as $item) {
            $total += $item['total']; // Each item's total (price * quantity)
        }

        $amountInCents = (int) round($total * 100);

        $paymentIntent = PaymentIntent::create([
            'amount' => $amountInCents,
            'currency' => 'usd',
            'payment_method_types' => ['card'],
        ]);

        return response()->json([
            'clientSecret' => $paymentIntent->client_secret,
        ]);
    }
}
