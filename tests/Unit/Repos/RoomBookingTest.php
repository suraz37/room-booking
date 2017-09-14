<?php

namespace Tests\Unit\Repos;

use App\Models\RoomBooking;
use App\Repos\RoomBookingRepository;
use Illuminate\Database\DatabaseManager;
use Tests\TestCase;
use Mockery as m;

class RoomBookingTest extends TestCase
{
    /**
     * @var m\MockInterface | RoomBooking
     */
    protected $roomBookingMock;
    /**
     * @var m\MockInterface | DatabaseManager
     */
    protected $dbMock;

    /**
     * @var RoomBookingRepository
     */
    protected $roomBookingRepository;

    public function setUp()
    {
        $this->roomBookingMock = m::mock(RoomBooking::class);
        $this->dbMock          = m::mock(DatabaseManager::class);

        $this->roomBookingRepository = new RoomBookingRepository(
            $this->roomBookingMock,
            $this->dbMock
        );
    }

    /**
     * @covers ::getBookingByDateRange
     */
    public function testGetBookingByDateRange()
    {
        $data   = [
            'date_from' => '2017-09-01',
            'date_to' => '2017-09-05'
        ];
        $result = [];

        $this->roomBookingMock
            ->shouldReceive('where')
            ->with('day', '>=', $data['date_from'])
            ->andReturnSelf()
            ->shouldReceive('where')
            ->with('day', '<=', $data['date_to'])
            ->andReturnSelf()
            ->shouldReceive('select')
            ->with(['id', 'room_type_id', 'day', 'price', 'currency', 'available_quantity'])
            ->andReturnSelf()
            ->shouldReceive('get')
            ->andReturn($result);

    }

    /**
     * @covers ::updateOrCreateBooking
     */
    public function testUpdateOrCreateBooking()
    {
        $data1  = [
            'room_type_id' => 1,
            'day' => 1
        ];
        $data2  = [
            'room_type_id' => 1,
            'day' => 1,
            'price' => 1,
            'available_quantity' => 1
        ];
        $result = [];
        $this->roomBookingMock
            ->shouldReceive('updateOrCreate')
            ->with($data1, $data2)
            ->andReturn($result);
    }

    /**
     * @covers ::bulkOperation
     */
    public function testBulkOperation()
    {
        $result = [];
        $param  = [
            'room_type_id' => 1,
            'day' => 2,
            'price' => 1,
            'quantity' => 1
        ];

        $this->dbMock
            ->shouldReceive('beginTransaction')
            ->andReturn(true);

        $this->roomBookingMock
            ->shouldReceive('updateOrCreate')
            ->with($param)
            ->andReturn($result);

        $this->dbMock
            ->shouldReceive('commit')
            ->andReturn(true);
    }

    /**
     * test for map store data and empty data for all date range.
     *
     * @covers ::mapBookingByDateRange
     */
    public function testMapBookingByDateRange()
    {
        $bookingData = [
            [
                'id' => 1,
                'room_type_id' => 1,
                'day' => '2017-09-01',
                'price' => 50,
                'available_quantity' => 10
            ]
        ];
        $start_date  = '2017-09-01';
        $end_date    = '2017-09-02';

        $expected = [
            [
                'id' => 1,
                'room_type_id' => 1,
                'day' => '2017-09-01',
                'price' => 50,
                'available_quantity' => 10
            ],
            [
                'id' => null,
                'room_type_id' => null,
                'day' => '2017-09-02',
                'price' => 0,
                'available_quantity' => 0
            ]
        ];

        $actual = $this->roomBookingRepository->mapBookingByDateRange($start_date, $end_date, $bookingData);

        $this->assertEquals($expected, $actual);

        $this->assertEquals(
            30,
            sizeof($this->roomBookingRepository->mapBookingByDateRange('2017-09-01', '2017-09-30', []))
        );
    }
}
