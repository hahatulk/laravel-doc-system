<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateDocumentRequestsTable extends Migration {
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up(): void {
        Schema::create('document_requests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('userId')
                ->references('id')->on('users')->onUpdate('cascade')->onDelete('cascade');
            $table->string('documentName');
            $table->foreign('documentName')->references('name')->on('default_documents')->onUpdate('cascade')->onDelete('cascade');
            $table->integer('status')->default('0');
            $table->tinyInteger('fullFilled')->default('0');
            $table->dateTime('fullFilledAt')->nullable();
            $table->text('comment')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down() {
        Schema::dropIfExists('document_requests');
    }
}
