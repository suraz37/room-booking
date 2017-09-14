<?php

namespace App\Http\Controllers;

use App\Repos\RoomBookingRepository;
use Illuminate\Contracts\Logging\Log;
use Illuminate\Database\DatabaseManager;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class RoomBookingController extends GenericController
{
    /**
     * @var $logger
     */
    protected $logger;
    /**
     * @var RoomBookingRepository
     */
    protected $bookingRepository;

    public function __construct(Log $logger, RoomBookingRepository $bookingRepository)
    {
        $this->logger            = $logger;
        $this->bookingRepository = $bookingRepository;
    }

    /**
     * @param Request $request
     *
     * @return mixed
     */
    public function index(Request $request)
    {
        $this->validate($request, [
            'date_from' => 'required|date_format:Y-m-d',
            'date_to' => 'required|date_format:Y-m-d',
        ]);

        // Validation fail bho bhane json aaucha ki aaudaina response ma bhaneko

        $response = $this->bookingRepository->getBookingByDateRange($request->only('date_from', 'date_to'));

        return response()->json($response);
    }

    /**
     * Bulk operation
     *
     * @param Request $request
     * @param DatabaseManager $databaseManager
     *
     * @return mixed
     */
    public function store(Request $request, DatabaseManager $databaseManager)
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

        $databaseManager->beginTransaction();

        try {
            $this->logger->info("Started the bulk operation action");
            $results = $this->bookingRepository->bulkOperation($params);

        } catch (\Exception $exception) {
            $databaseManager->rollack();

            $this->logger->error("Error during bulk operation");

            return response()->json(['status' => false, 'error' => $exception->getMessage()],
                Response::HTTP_UNPROCESSABLE_ENTITY);
        }
        $databaseManager->commit();

        return response()->json(['status' => isset($results)], Response::HTTP_CREATED);
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

        $result = $this->bookingRepository->updateOrCreateBooking($params);

        return response()->json(['status' => !empty($result) ? true : false], Response::HTTP_CREATED);
    }
}
