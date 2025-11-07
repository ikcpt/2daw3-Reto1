<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PalabraController;



Route::get('/palabras', [PalabraController::class, 'index'])->name('palabras.index');
Route::get('/palabrasStyled', [PalabraController::class, 'indexStyled'])->name('palabras.indexStyled');
route::get('/palabrasBlade', [PalabraController::class, 'indexBlade'])->name('palabras.indexBlade');

//Ruta que devuelve de la tabla 'palabras' una palabra aleatoria
//Route::get('/palabrasRandom/', [PalabraController::class, indexRandom'])->name('palabras.indexRandomw');

//Ruta que devuelve de la tabla 'palabras' la cantidad de palabras aleatorias solicitada por URL y sino, devuelve 5 palabras
Route::get('/palabrasRandom/{cantidad?}', [PalabraController::class, 'indexRandom'])->name('palabras.indexRandomw');

//Ruta que verifica si la palabra dada en la ruta existe en la tabla 'palabras' y devuelve json
Route::get('/verificarPalabra/{palabra}', [PalabraController::class, 'verificarPalabra'])
         ->middleware(['auth', 'verified'])
         ->name('palabras.verificarPalabra');

Route::get('/dashboard', function () {
    return view('dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::get('/juego', function () {
    return view('juego'); // Muestra index.blade.php cuando alguien visita /
});

Route::get('/', function () {
    return view('bienvenida'); // Muestra iniciarSesion.blade.php en /login
});

Route::get('/perfil', function () {
    return view('perfil'); // Muestra perfil.blade.php en /perfil
});

Route::get('/estadisticas', function () {
    return view('estadisticas'); // Muestra estadisticas.blade.php en /estadisticas
});


Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
