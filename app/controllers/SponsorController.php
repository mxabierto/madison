<?php

class SponsorController extends Controller
{
    /**
     * Shows form for requesting role as Independent Sponsor.
     */
    public function getRequest()
    {
        $data = [
      'page_id'     => 'sponsor_request',
      'page_title'  => "Request Sponsor",
    ];

        return View::make('documents.sponsor.request.index', $data);
    }

  /**
   * Saves user submissions for Independent Sponsor requests.
   */
  public function postRequest()
  {
      //Grab input
    $address1 = Input::get('address1');
      $address2 = Input::get('address2');
      $city = Input::get('city');
      $state = Input::get('state');
      $postal = Input::get('postal');
      $phone = Input::get('phone');
      $all_input = Input::all();

    //Validate input
    $rules = [
      'address1' => 'required',
      'city'     => 'required',
      'state'    => 'required',
      'postal'   => 'required',
      'phone'    => 'required',
    ];
      $validation = Validator::make($all_input, $rules);
      if ($validation->fails()) {
          return Redirect::route('sponsorRequest')->withInput()->withErrors($validation);
      }

    //Add new user information to their record
    $user = Auth::user();
      $user->address1 = $address1;
      $user->address2 = $address2;
      $user->city = $city;
      $user->state = $state;
      $user->postal_code = $postal;
      $user->phone = $phone;
      $user->save();

    //Add UserMeta request
    $request = new UserMeta();
      $request->meta_key = UserMeta::TYPE_INDEPENDENT_SPONSOR;
      $request->meta_value = 0;
      $request->user_id = $user->id;
      $request->save();

      return Redirect::route('editUser', $user->id)->with('message', trans('messages.reqreceived'));
  }
}
