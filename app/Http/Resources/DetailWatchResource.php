<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DetailWatchResource extends DisplayWatchResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $data = parent::toArray($request);
        $additionalData = [
            'id' => $this->id,
            'brand' => $this->whenLoaded('brand',function(){
                return $this->brand->name;
            }),
            'features' => $this->whenLoaded('features',function(){
                return $this->features->select('name');
            }),
            'strap' => $this->whenLoaded('strap',function(){
                return $this->strap->name;
            }),
            'brand' => $this->whenLoaded('brand',function(){
                return $this->brand->name;
            }),
            'caseColor' => $this->whenLoaded('caseColor',function(){
                return $this->caseColor->name;
            }),
            'dialColor' => $this->whenLoaded('dialColor',function(){
                return $this->dialColor->name;
            }),
            'dialShape' => $this->whenLoaded('dialShape',function(){
                return $this->dialShape->name;
            }),
            'energy' => $this->whenLoaded('energy',function(){
                return $this->energy->name;
            }),
            'watchCollection' => $this->whenLoaded('watchCollection',function(){
                return $this->watchCollection->name;
            }),
            'waterResistanceLevels' => $this->whenLoaded('waterResistanceLevels',function(){
                return $this->waterResistanceLevels->name;
            }),
            'warranty' => $this->warranty,
            'origin' => $this->origin,
            'weight' => $this->weight,
            'stockQuantity' => $this->stock_quantity,
            'description' => $this->description,
            'galleries' => $this->whenLoaded('watchGalleries', function () {
                return $this->watchGalleries->sortBy('serial')->map(function ($gallery) {
                    return ['banner' => transformImageUrl($gallery->banner)];
                })->values();
            }),
            'meta_title' => $this->meta_title,
            'meta_description' => $this->meta_description,
        ];
        return array_merge($data,$additionalData);
    }
}
