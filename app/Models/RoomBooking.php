<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RoomBooking extends Model
{
    protected $fillable = ['room_type_id', 'day', 'price', 'currency', 'available_quantity'];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasOne
     */
    public function RoomType()
    {
        return $this->hasOne('RoomType');
    }
}
