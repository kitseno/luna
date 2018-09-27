<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\ResourceCollection;

class UserCollection extends ResourceCollection
{
    private $activeUsers;
    
    public function __construct($collection, $activeUsers)
    {
        // Ensure you call the parent constructor
        parent::__construct($collection);
        // $this->collection = $collection;
        
        $this->activeUsers = $activeUsers;
    }

    /**
     * Transform the resource collection into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {

        return [
            'data' => $this->collection,
            // 'links' => [
            //     'self' => '/admin/users',
            // ],
            'meta' => [
                'activeUsers' => $this->activeUsers->pluck('tokens')->count(),
            ],
        ];
    }
}
