<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BrandGalleryResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'brand_id' => $this->brand_id,
            'banner' => transformImageUrl($this->banner),
            'type' => $this->type,
            'serial' => $this->serial,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
