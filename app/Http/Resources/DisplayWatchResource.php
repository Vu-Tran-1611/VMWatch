<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DisplayWatchResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'name' => $this->name,
            'gender' => $this->gender,
            'energy' => $this->whenLoaded('energy',function(){
                return $this->energy->name;
            }),
            'dialSize' => $this->whenLoaded('dialSize',function(){
                return $this->dialSize->name;
            }),
            'glassMaterial' => $this->whenLoaded('glassMaterial',function(){
                return $this->glassMaterial->name;
            }),
            'front' => $this->whenLoaded('watchGalleries', function () {
                $frontImage = $this->watchGalleries->where('type', 'front')->first();
                return $frontImage ? transformImageUrl($frontImage->banner) : null;
            }),
            'thumb' => $this->whenLoaded('watchGalleries', function () {
                $thumbImage = $this->watchGalleries->where('type', 'thumb')->first();
                return $thumbImage ? transformImageUrl($thumbImage->banner) : null;
            }),
            'price'=> $this->price,
            'description'=> $this->description,
            'slug' => $this->slug,
        ];
    }
}
