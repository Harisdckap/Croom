<?php

namespace App\Http\Controllers\Auth;


use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;
use App\Models\OTPVerification;
use Tymon\JWTAuth\Facades\JWTAuth;
use Laravel\Socialite\Facades\Socialite;
use Exception;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Collection;


class RegisterController extends Controller
{
    public function register(Request $request)
    {
        $existingUser = User::where('email', $request->email)->first();
        if ($existingUser) {
            return response()->json([
                'success' => false,
                'message' => 'User already registered. Please login.'
            ], 409);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'gender' => 'required|string',
            'mobile' => 'required|string|max:10',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'user_type' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'gender' => $request->gender,
            'mobile' => $request->mobile,
        ]);

        //generate OTP
        $otp = rand(100000, 999999);

        //store OTP in database
        OTPVerification::create([
            'user_id' => $user->id,
            'otp' => $otp,
            'otp_expire_at' => now()->addMinutes(10),
        ]);

        //generate JWT token
        $token = JWTAuth::fromUser($user);

        //send OTP via email
        Mail::send('auth.emails.otp', ['otp' => $otp, 'auth_token' => $token], function ($message) use ($user) {
            $message->to($user->email);
            $message->subject('Your OTP Code');
        });

        return response()->json([
            'success' => true,
            'message' => 'User registered successfully. Please check your email for the OTP.',
            'access_token' => $token,
            'user_id' => $user->id,
        ], 201);
    }


    public function redirectToGoogle()
    {

        return Socialite::driver('google')->redirect();
    }
    public function handleGoogleCallback()
    {
        try {

            //create a user using socialite driver google
            $user = Socialite::driver('google')->user();

            $profile = $user->getAvatar();
            // if the user exits, use that user and login
            $finduser = User::where('google_id', $user->getId())->first();

            if ($finduser) {
                //if the user exists, login and show dashboard
                Auth::login($finduser);
                return response()->json([
                    'success' => true,
                    'message' => 'User logged in successfully.'
                ]);
            } else {
                //user is not yet created, so create first
                $newUser = User::create([
                    'name' => $user->getName(),
                    'email' => $user->getEmail(),
                    'google_id' => $user->getId(),
                    'user_type' => 3,
                ]);


                //generate JWT token
                $token = JWTAuth::fromUser($newUser);

                Auth::login($newUser);
                //go to the dashboard
                return response()->json([
                    'success' => true,
                    'message' => 'User registered successfully.',
                    'access_token' => $token,
                    'user_id' => $newUser->id,
                ], 201);
            }
            //catch exceptions
        } catch (Exception $e) {
            dd($e->getMessage());
        }

    }
    public function changePassword(Request $request, $userId)
    {

        // Validate input fields
        $validator = Validator::make($request->all(), [
            'existingPassword' => 'required',
            'newPassword' => 'required|min:8|confirmed',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => 'Validation failed', 'messages' => $validator->errors()], 422);
        }

        $user = User::find($userId);

        if (!$user) {
            return response()->json(['error' => ' user not found'], 400);
        }

        // Check if existing password is correct
        if (!Hash::check($request->input('existingPassword'), $user->password)) {
            return response()->json(['error' => 'Current password is incorrect'], 400);
        }

        // Update password and save user
        $user->password = Hash::make($request->input('newPassword'));
        $user->save();

        return response()->json(['message' => 'Password changed successfully']);
    }



    public function logout(Request $request)
    {
        try {
            $token = str_replace('Bearer ', '', $request->header('Authorization')); // Extract token
            if ($token) {
                JWTAuth::parseToken()->invalidate(); // Invalidate the JWT token
                return response()->json([
                    'success' => true,
                    'message' => 'User logged out successfully.'
                ]);
            } else {
                return response()->json([
                    'success' => false,
                    'message' => 'Authorization token not found.'
                ], 401);
            }
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to log out, please try again.'
            ], 500);
        }
    }



    public function updateProfile(Request $request)
    {
        $user = auth()->user();

        // Validation rules
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
            'mobile' => 'required|string|max:10',
            'photo' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Update user profile
        $user->name = $request->name;
        $user->email = $request->email;
        $user->gender = $request->gender;
        $user->mobile = $request->mobile;

        // Handle photo upload
        if ($request->hasFile('photo')) {
            // Delete old photo if exists
            if ($user->photo) {
                Storage::delete($user->photo);
            }

            // Store new photo
            $photoPath = $request->file('photo')->store('profile_photos');
            $user->photo = $photoPath;
        }

        $user->save();

        return response()->json([
            'success' => true,
            'message' => 'Profile updated successfully.',
            'user' => $user,
        ], 200);
    }
}
