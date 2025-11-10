<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class RankingController extends Controller
{
    public function index()
    {
        $usuarios = User::orderByDesc('score')->take(10)->get();
        return view('ranking', compact('usuarios'));
    }
    public function actualizarPuntuacion(Request $request) {
    $datos = $request->validate([
        'score' => 'required|integer|min:0',
    ]);

    $user = Auth::user();
    $user->score += $datos['score']; // Suma la puntuación a la existente
    $user->save();

    return response()->json(['success' => true]);
    }
}
