<?php

namespace Database\Seeders;

use App\Models\DefaultDocument;
use Illuminate\Database\Seeder;

class DefaultDocumentSeeder extends Seeder {
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run() {
        DefaultDocument::factory()->create([
            'title' => 'Об обучении',
            'name' => 'spravka_ob_obuchenii',
            'type' => 'справка',
            'path' => '',
        ]);

        DefaultDocument::factory()->create([
            'title' => 'О зачислении',
            'name' => 'prikaz_o_zachislenii',
            'type' => 'приказ',
            'path' => '',
        ]);

        DefaultDocument::factory()->create([
            'title' => 'Об отчислении',
            'name' => 'prikaz_ob_otchislenii',
            'type' => 'приказ',
            'path' => '',
        ]);

        DefaultDocument::factory()->create([
            'title' => 'Об переводе на бюджетную основу',
            'name' => 'prikaz_na_budget',
            'type' => 'приказ',
            'path' => '',
        ]);
    }
}
