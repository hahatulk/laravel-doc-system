<?php

namespace Database\Seeders;

use App\Models\DefaultDocument;
use App\Models\DocumentRequest;
use App\Models\Prikaz;
use Illuminate\Database\Seeder;

class DefaultDocumentSeeder extends Seeder {
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run(): void {
        DefaultDocument::factory()->create([
            'title' => 'Об обучении',
            'name' => DocumentRequest::SPRAVKA_OB_OBUCHENII,
            'type' => 'справка',
            'path' => '',
        ]);

        DefaultDocument::factory()->create([
            'title' => 'О зачислении',
            'name' => Prikaz::PRIKAZ_ZACHISLENIE,
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
