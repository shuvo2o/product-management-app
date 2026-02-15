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
            'amount'  => 'required|numeric|min:10|max:500000',
            'phone'   => ['required', 'regex:/^(?:\+88|88)?(01[3-9]\d{8})$/'], 
            'address' => 'required|string|min:10|max:255',
        ];
    }

    // ঐচ্ছিক: এরর মেসেজগুলো কাস্টমাইজ করতে পারেন
    public function messages()
    {
        return [
            'phone.regex' => 'অনুগ্রহ করে সঠিক বাংলাদেশি মোবাইল নম্বর দিন।',
            'amount.min' => 'সর্বনিম্ন ১০ টাকা পেমেন্ট করতে হবে।',
        ];
    }
}