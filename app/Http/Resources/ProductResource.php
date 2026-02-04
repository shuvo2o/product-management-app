<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id'          => $this->id,
            'name'        => $this->name,
            'price'       => (float) $this->price,
            'stock'       => (int) $this->stock,
            'image_url'   => $this->image ? asset('storage/' . $this->image) : null,
            'category'    => new CategoryResource($this->whenLoaded('category')),
            'updated_at'  => $this->updated_at->toDateTimeString(),
        ];
    }
}
