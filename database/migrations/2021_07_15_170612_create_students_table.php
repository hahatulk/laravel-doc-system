<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateStudentsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('students', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('userId');
            $table->foreign('userId')->references('id')->on('users');
            $table->string('surname');
            $table->string('name');
            $table->string('patronymic')->nullable();
            $table->string('gender');
            $table->date('birthday');
            $table->integer('group');
            $table->integer('zachislenPoPrikazu');
            $table->foreign('zachislenPoPrikazu')->references('N')->on('prikazs');
            $table->integer('formaObuch');
            $table->integer('status');
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
        Schema::dropIfExists('students');
    }
}
