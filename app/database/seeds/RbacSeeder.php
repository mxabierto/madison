<?php

use Illuminate\Database\Seeder;

class RbacSeeder extends Seeder
{
    private $adminPermissions = [
        'ManageDocuments' => [
            'name'         => 'admin_manage_documents',
            'display_name' => 'Manage Documents',
        ],
        'ManageSettings' => [
            'name'         => 'admin_manage_settings',
            'display_name' => "Manage Settings",
        ],
        'VerifyUsers' => [
            'name'         => "admin_verify_users",
            'display_name' => "Verify Users",
        ],
    ];

    public function run()
    {
        $adminEmail = Config::get('madison.seeder.admin_email');

        $admin = new Role();
        $admin->name = 'Admin';
        $admin->save();

        $independent_sponsor = new Role();
        $independent_sponsor->name = 'Independent Sponsor';
        $independent_sponsor->save();

        $permIds = [];
        foreach ($this->adminPermissions as $permClass => $data) {
            $perm = new Permission();

            foreach ($data as $key => $val) {
                $perm->$key = $val;
            }

            $perm->save();

            $permIds[] = $perm->id;
        }

        $admin->perms()->sync($permIds);

        $user = User::where('email', '=', $adminEmail)->first();
        $user->attachRole($admin);

        $createDocPerm = new Permission();
        $createDocPerm->name = "independent_sponsor_create_doc";
        $createDocPerm->display_name = "Independent Sponsoring";
        $createDocPerm->save();

        $independent_sponsor->perms()->sync([$createDocPerm->id]);
    }
}
