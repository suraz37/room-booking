<?php

namespace Tests\Feature;

use App\Models\RoomType;
use Tests\TestCase;
use Illuminate\Foundation\Testing\DatabaseTransactions;

class RoomBookingControllerTest extends TestCase
{
    use DatabaseTransactions;

    /**
     * test for getting date range.
     */
    public  function  testIndex() {
        $response = $this->get('booking?date_from=2017-09-01&date_to=2017-09-15');
        $response->assertStatus(200);
    }

    /**
     * Test bulk operation
     */
    public function testBulkOperation() {
        $roomType = RoomType::inRandomOrder()->get(['id', 'inventory'])->first();
        $data = [
            'room_type_id' => $roomType->id,
            'price' => 12,
            'quantity' => $roomType->id,
            'date_from' => '2017-10-11',
            'date_to' => '2017-10-15',
            'checked_days' => ['sundays']
        ];
        $response = $this->post('booking', $data, [
            'Accept' => 'application/json'
        ]);
        $response ->assertStatus(201)
            ->assertJson([
                'status' => true
            ]);
    }

    /**
     * Test single operation
     */
    public function testSingeOperation() {
        $roomType = RoomType::inRandomOrder()->get(['id', 'inventory'])->first();
       $data = [
           'room_type_id' => $roomType->id,
           'price' => 12,
           'quantity' => $roomType->inventory,
           'day' => '2017-10-11'
       ];
       $response = $this->post('single-operation', $data, [
           'Accept' => 'application/json'
       ]);
       $response ->assertStatus(201)
           ->assertJson([
               'status' => true
           ]);
    }
}
