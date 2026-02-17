<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\PaymentRequest;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use Illuminate\Http\Client\Response;

class SslCommerzPaymentController extends Controller
{
    public function index(PaymentRequest $request)
    {
        DB::beginTransaction();

        try {
            $user = Auth::user();
            $tran_id = "TXN_" . uniqid();

            $order = Order::create([
                'user_id'        => $user->id,
                'name'           => $user->name,
                'email'          => $user->email,
                'phone'          => $request->phone,
                'amount'         => $request->amount,
                'address'        => $request->address,
                'transaction_id' => $tran_id,
                'status'         => 'Pending',
                'currency'       => 'BDT',
            ]);

            $post_data = [
                'store_id'         => env('SSLC_STORE_ID'),
                'store_passwd'     => env('SSLC_STORE_PASSWORD'),
                'total_amount'     => $order->amount,
                'currency'         => "BDT",
                'tran_id'          => $tran_id,
                'success_url'      => env('SSLC_SUCCESS_URL'),
                'fail_url'         => env('SSLC_FAILED_URL'),
                'cancel_url'       => env('SSLC_CANCEL_URL'),
                'ipn_url'          => env('SSLC_IPN_URL'),
                'cus_name'         => $order->name,
                'cus_email'        => $order->email,
                'cus_add1'         => $order->address,
                'cus_phone'        => $order->phone,
                'shipping_method'  => "NO",
                'product_name'     => "Order_" . $tran_id,
                'product_category' => "General",
                'product_profile'  => "general",
            ];

            $api_url = env('SSLC_IS_SANDBOX')
                ? "https://sandbox.sslcommerz.com/gwprocess/v4/api.php"
                : "https://securepay.sslcommerz.com/gwprocess/v4/api.php";

            /** @var Response $response */
            $response = Http::withoutVerifying()->asForm()->post($api_url, $post_data);

            if ($response->successful()) {
                $result = $response->json();
                if (isset($result['GatewayPageURL']) && $result['GatewayPageURL'] != "") {
                    DB::commit();
                    return response()->json(['status' => 'success', 'url' => $result['GatewayPageURL']]);
                }
            }

            throw new \Exception("SSLCommerz Gateway Response Error: " . ($response->body() ?? 'No response'));
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error("Payment Initiation Error: " . $e->getMessage());
            return response()->json(['status' => 'error', 'message' => 'Gateway connection failed: ' . $e->getMessage()], 500);
        }
    }

    public function success(Request $request)
    {
        $tran_id = $request->input('tran_id');
        $val_id = $request->input('val_id');

        $order = Order::where('transaction_id', $tran_id)->first();

        if (!$order) {
            return response()->json(['message' => 'Order not found'], 404);
        }

        $verify_url = env('SSLC_IS_SANDBOX')
            ? "https://sandbox.sslcommerz.com/validator/api/validationserverphp.php"
            : "https://securepay.sslcommerz.com/validator/api/validationserverphp.php";

        /** @var Response $response */
        $response = Http::withoutVerifying()->get($verify_url, [
            'val_id'       => $val_id,
            'store_id'     => env('SSLC_STORE_ID'),
            'store_passwd' => env('SSLC_STORE_PASSWORD'),
            'format'       => 'json'
        ]);

        if ($response->successful()) {
            $result = $response->json();
            if ($result['status'] == 'VALIDATED' || $result['status'] == 'VALID') {
                if ($order->amount == $result['amount'] && $order->status == 'Pending') {
                    $order->update(['status' => 'Complete']);
                    return redirect('http://localhost:3000/payment/success?id=' . $tran_id);
                }
            }
        }

        $order->update(['status' => 'Failed']);
        return redirect('http://localhost:3000/payment/fail');
    }

    public function fail(Request $request)
    {
        Order::where('transaction_id', $request->tran_id)->update(['status' => 'Failed']);
        return redirect('http://localhost:3000/payment/fail');
    }

    public function cancel(Request $request)
    {
        Order::where('transaction_id', $request->tran_id)->update(['status' => 'Canceled']);
        return redirect('http://localhost:3000/payment/cancel');
    }

    public function ipn(Request $request)
    {
        $order = Order::where('transaction_id', $request->tran_id)->where('status', 'Pending')->first();
        if ($order && ($request->status == 'VALIDATED' || $request->status == 'VALID')) {
            $order->update(['status' => 'Complete']);
        }
        return response()->json(['message' => 'IPN Success']);
    }

    public function orderHistory()
    {
        $user = Auth::user();
        $orders = Order::where('user_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'status' => 'success',
            'data'   => $orders
        ]);
    }
}