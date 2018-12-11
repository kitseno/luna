<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\ResourceCollection;

class UserCollection extends ResourceCollection
{
    private $activeUsers;
    private $totalUsers;
    private $newUsersToday;
    
    
    public function __construct($collection, $activeUsers, $totalUsers, $newUsersToday)
    {
        // Ensure you call the parent constructor
        parent::__construct($collection);
        // $this->collection = $collection;
        
        $this->activeUsers = $activeUsers;
        $this->totalUsers = $totalUsers;
        $this->newUsersToday = $newUsersToday;
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
                // 'activeUsers' => $this->activeUsers->pluck('tokens')->count(),
                'activeUsers' => $this->activeUsers,
                'totalUsers' => $this->totalUsers,
                'newUsersToday' => $this->newUsersToday,
            ],
        ];
    }
}
