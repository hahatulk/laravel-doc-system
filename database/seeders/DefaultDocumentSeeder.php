<?php

namespace Database\Seeders;

use App\Models\DefaultDocument;
use Illuminate\Database\Seeder;

class DefaultDocumentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DefaultDocument::factory()->create([
            'title'=> 'Об обучении',
            'name'=> 'справка_об_обучении',
            'type'=> 'справка',
            'path'=> '',
        ]);

        DefaultDocument::factory()->create([
            'title'=> 'О зачислении',
            'name'=> 'приказ_о_зачислении',
            'type'=> 'приказ',
            'path'=> '',
        ]);

        DefaultDocument::factory()->create([
            'title'=> 'Об отчислении',
            'name'=> 'приказ_об_отчислении',
            'type'=> 'приказ',
            'path'=> '',
        ]);

        DefaultDocument::factory()->create([
            'title'=> 'Об переводе на бюджетную основу',
            'name'=> 'приказ_о_переводе_на_бюджет',
            'type'=> 'приказ',
            'path'=> '',
        ]);
    }
}
