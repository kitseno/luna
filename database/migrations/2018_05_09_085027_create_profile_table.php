<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateProfileTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        // Schema::create('profile', function (Blueprint $table) {
        //     $table->increments('id');
        //     $table->timestamps();
        // });

        Schema::dropIfExists('profiles');

        Schema::create('profiles', function (Blueprint $table) {
            // $table->increments('profile_id');
            $table->uuid('user_id');
            $table->string('about');
            $table->timestamps();

            $table->foreign('user_id')
                ->references('id')
                ->on('users')
                ->onDelete('cascade');

            $table->primary(['user_id']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('profiles');
    }
}
