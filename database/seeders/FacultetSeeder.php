<?php

namespace Database\Seeders;

use App\Models\Facultet;
use Illuminate\Database\Seeder;

class FacultetSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        //
        Facultet::factory()->create([
            'name'=> 'Дошкольное образование',
        ]);

        Facultet::factory()->create([
            'name'=> 'Информационные системы и программирование',
        ]);

        Facultet::factory()->create([
            'name'=> 'Музыкальное образование',
        ]);

        Facultet::factory()->create([
            'name'=> 'Преподавание в начальных классах',
        ]);
    }
}
