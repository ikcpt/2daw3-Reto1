<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Palabra;
use Illuminate\Support\Facades\Http;

class PalabraController extends Controller
{
 public function indexRandom($cantidad = 1) {
    $palabrasEncontradas = [];
    for ($i = 0; $i < $cantidad; $i++) {
        
        $palabraValida = null;
        while ($palabraValida === null) {
            
            $palabraAleatoria = Palabra::inRandomOrder()->first();
            
            if (!$palabraAleatoria) {
                continue; 
            }
            
            $palabraLimpia = trim($palabraAleatoria->palabra);

            if (mb_strlen($palabraLimpia) == 5) {
                
                $respuestaJson = $this->verificarPalabra($palabraLimpia);

                $datosVerificacion = $respuestaJson->getData(true); 

                if (isset($datosVerificacion['exists']) && $datosVerificacion['exists']) {
                    $palabraValida = $palabraLimpia;
                }

            }
        }
        $palabrasEncontradas[] = $palabraValida;
    }
    
    return response()->json($palabrasEncontradas);
}
public function verificarPalabra($palabra)
{
    try {
        $palabraEnMinusculas = strtolower($palabra);

        $response = Http::get("http://185.60.43.155:3000/api/check/{$palabraEnMinusculas}");

        if ($response->failed()) {
            return response()->json(['existe' => false, 'exists' => false]);
        }

        $data = $response->json();
        $exists = null;
        if (isset($data['exists'])) {
            $exists = (bool) $data['exists'];
        } elseif (isset($data['existe'])) {
            $exists = (bool) $data['existe'];
        } elseif (isset($data['found'])) { 
            $exists = (bool) $data['found'];
        } else {
            $exists = !empty($data);
        }

        return response()->json(['existe' => $exists, 'exists' => $exists, 'raw' => $data]);

    } catch (\Exception $e) {
        return response()->json(['existe' => false, 'exists' => false]);
    }
}
}