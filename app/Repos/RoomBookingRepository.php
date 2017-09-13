<?php

namespace App\Repos;

use App\Models\RoomBooking;
use Carbon\Carbon;
use Illuminate\Database\DatabaseManager;

class RoomBookingRepository
{
    protected $roomBooking;
    protected $db;

    public function __construct(RoomBooking $roomBooking, DatabaseManager $db)
    {
        $this->roomBooking = $roomBooking;
        $this->db          = $db;
    }

    /**
     * Get all booking data for Date range
     *
     * @param array $data
     *
     * @return array
     */
    public function getBookingByDateRange(array $data) : array
    {
        $booking = $this->roomBooking
            ->where('day', '>=', $data['date_from'])
            ->where('day', '<=', $data['date_to'])
            ->select(['id', 'room_type_id', 'day', 'price', 'currency', 'available_quantity'])
            ->get();

        return $this->mapBookingByDateRange($data['date_from'], $data['date_to'], $booking->toArray());
    }

    /**
     * Create or update data on booking
     *
     * @param $data
     *
     * @return \Illuminate\Database\Eloquent\Model
     */
    public function updateOrCreateBooking(array $data) : RoomBooking
    {
        $result = $this->roomBooking->updateOrCreate(
            [
                'room_type_id' => $data['room_type_id'],
                'day' => $data['day'],
            ],
            [
                'room_type_id' => $data['room_type_id'],
                'day' => $data['day'],
                'price' => $data['price'],
                'available_quantity' => $data['quantity']
            ]
        );

        return $result;
    }

    /**
     * @param $data
     * @param array $selectedDays
     *
     * @return array
     */
    public function bulkOperation(array $data) : array
    {
        $result = [];
        $start  = Carbon::createFromFormat('Y-m-d', $data['date_from']);
        $end    = Carbon::createFromFormat('Y-m-d', $data['date_to']);

        $this->db->beginTransaction();
        while($start->lte($end)) {
            if(in_array(strtolower($start->format('l')), $data['checked_days'])) {
                $data['day']      = $start->toDateString();
                $result[] = $this->updateOrCreateBooking($data);
            }
            $start->addDay();
        }
        $this->db->commit();

        return $result;
    }

    /**
     * Map data for room and days
     * Indexing key with date
     * Check if all date range key is exist
     * Fill date key with empty data if not exist
     * Sort by date key
     *
     * @param string $startDate
     * @param string $endDate
     * @param $response
     *
     * @return array
     */
    public function mapBookingByDateRange(
        string $startDate ,
        string $endDate,
        array $data
    ) : array {
        $start = Carbon::createFromFormat('Y-m-d', $startDate);
        $end  = Carbon::createFromFormat('Y-m-d', $endDate);

        $emptyArray = [
            'id' => null,
            'room_type_id' => null,
            'day' => null,
            'price' => 0,
            'available_quantity' => 0
        ];

        $dataByDate = array_combine( array_column($data, 'day'), $data);
        $range = [];

        while($start->lte($end)) {
            $current = $start->toDateString();
            if(!array_key_exists($current, $dataByDate)) {
                $emptyArray['day'] = $current;
                $range[$current] = $emptyArray;
            } else {
                $range[$current] = $dataByDate[$current];
            }
            $start->addDay();
        }
        ksort($range);

        return  array_values($range);
    }
}
