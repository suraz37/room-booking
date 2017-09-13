<?php

namespace App\Http\Controllers;

use App\Repos\RoomBookingRepository;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class RoomBookingController extends Controller
{
    protected $bookingRepository;

    public function __construct(RoomBookingRepository $bookingRepository)
    {
        $this->bookingRepository = $bookingRepository;
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $this->validate($request, [
            'date_from' => 'required|date_format:Y-m-d',
            'date_to' => 'required|date_format:Y-m-d',
        ]);
        $params = $request->only('date_from', 'date_to');

        $response = $this->bookingRepository->getBookingByDateRange($params);

        return response()->json($response);
    }

    /**
     *  Bulk operation for room booking
     *
     * @param Request $request
     *
     * @return mixed
     */
    public function store(Request $request)
    {
        $this->validate($request, [
            'room_type_id' => 'required|integer|exists:room_types,id',
            'checked_days' => 'required|array',
            'checkedDays.*' => 'in:monday,tuesday,wednesday,thursday,friday,saturday,sunday',
            'price' => 'required|min:1',
            'quantity' => 'required|integer|min:1|max:5',
            'date_from' => 'required|date_format:Y-m-d',
            'date_to' => 'required:after:date_from:date_format:Y-m-d',
        ]);
        $params = $request->only('room_type_id', 'checked_days', 'price', 'quantity', 'date_from', 'date_to');

        $this->bookingRepository->bulkOperation($params);

        return response()->json(['status' => true], Response::HTTP_CREATED);
    }

    /**
     * Single Operation for room booking
     *
     * @param Request $request
     *
     * @return mixed
     */
    public function singleOperation(Request $request)
    {
        $this->validate($request, [
            'room_type_id' => 'required|integer|exists:room_types,id',
            'day' => 'required|date_format:Y-m-d',
            'price' => 'integer|min:0',
            'quantity' => 'integer'
        ]);
        $params = $request->only('room_type_id', 'day', 'price', 'quantity');

        $this->bookingRepository->updateOrCreateBooking($params);

        return response()->json(['status' => true], Response::HTTP_CREATED);
    }
}
