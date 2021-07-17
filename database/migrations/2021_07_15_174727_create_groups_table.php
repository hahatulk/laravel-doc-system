<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateGroupsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('groups', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->tinyInteger('inProgress')->default('1');
            $table->integer('kurs');
            $table->date('startDate');
            $table->date('finishDate');
            $table->integer('groupType');
            $table->string('facultet');
            $table->foreign('facultet')->references('name')->on('facultets');
            $table->integer('prikazOtchislenieN')->nullable();
            $table->foreign('prikazOtchislenieN')->references('N')->on('prikazs');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('groups');
    }
}
