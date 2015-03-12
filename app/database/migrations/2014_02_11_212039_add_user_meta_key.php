<?php

use Illuminate\Database\Migrations\Migration;

class AddUserMetaKey extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('user_meta', function ($table) {
            $table->unique(['user_id', 'meta_key']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('user_meta', function ($table) {
            $table->dropUnique('user_meta_user_id_meta_key_unique');
        });
    }
}
