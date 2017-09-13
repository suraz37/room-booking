<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateRoomBookingsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('room_bookings', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('room_type_id');
            $table->date('day');
            $table->float('price')->default('60000');
            $table->char('currency', 4)->default('IDR');
            $table->unsignedInteger('available_quantity')->default(2);
            $table->timestamps();
            $table->foreign('room_type_id')->references('id')->on('room_types');
            $table->unique(['day', 'room_type_id']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('room_bookings');
    }
}
