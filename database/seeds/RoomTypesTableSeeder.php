<?php

use Illuminate\Database\Seeder;
use App\Models\RoomType;

class RoomTypesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        RoomType::firstOrCreate([
            'name' => 'single room'
        ]);

        RoomType::firstOrCreate([
            'name' => 'double room'
        ]);

    }
}
