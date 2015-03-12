<?php

use Illuminate\Database\Seeder;

class GroupsTableSeeder extends Seeder
{
    public function run()
    {
        $group = new Group();
        $group->status = Group::STATUS_ACTIVE;
        $group->name = 'México Abierto';
        $group->display_name = 'mx_a';
        $group->save();

        $adminEmail = Config::get('madison.seeder.admin_email');
        $adminPassword = Config::get('madison.seeder.admin_password');

        $userEmail = Config::get('madison.seeder.user_email');

        // Login as admin to add members to group
        $credentials = ['email' => $adminEmail, 'password' => $adminPassword];

        Auth::attempt($credentials);

        $admin = User::where('email', '=', $adminEmail)->first();
        $user = User::where('email', '=', $userEmail)->first();

        $group->addMember($admin->id, Group::ROLE_OWNER);
        $group->addMember($user->id, Group::ROLE_EDITOR);
    }
}
