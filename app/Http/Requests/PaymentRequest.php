<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PaymentRequest extends FormRequest
{
    public function authorize()
    {
        return true; 
    }

    public function rules()
    {
     return [
        'amount'  => 'required|numeric', 
        'phone'   => 'required', 
        'address' => 'required|string', 
    ];
    }

    public function messages()
    {
        return [
            'phone.regex' => 'অনুগ্রহ করে সঠিক বাংলাদেশি মোবাইল নম্বর দিন।',
            'amount.min' => 'সর্বনিম্ন ১০ টাকা পেমেন্ট করতে হবে।',
        ];
    }
}