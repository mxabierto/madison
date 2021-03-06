<?php

use Illuminate\Database\Seeder;

class UsersTableSeeder extends Seeder
{
    public function run()
    {
        $creds = Config::get('madison.seeder');

        DB::table('users')->insert([
            'email'    => $creds['admin_email'],
            'password' => Hash::make($creds['admin_password']),
            'fname'    => $creds['admin_fname'],
            'lname'    => $creds['admin_lname'],
            'token'    => '',
        ]);

        DB::table('users')->insert([
      'email'    => $creds['user_email'],
      'password' => Hash::make($creds['user_password']),
      'fname'    => $creds['user_fname'],
      'lname'    => $creds['user_lname'],
      'token'    => '',
    ]);
    }
}
