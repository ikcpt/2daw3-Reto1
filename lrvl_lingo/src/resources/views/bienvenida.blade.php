<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bienvenido a Lingo</title>
    <link rel="stylesheet" href="{{ asset('css/auth-style.css') }}">
</head>
<body>
    <div class="auth-container welcome-container">
        
        <h2>Bienvenido a Lingo</h2>
        <p>Por favor, inicia sesión o regístrate para continuar.</p>

        <div class="button-group">
            <a href="{{ route('login') }}" class="btn btn-primary">
                Iniciar Sesión
            </a>
            <a href="{{ route('register') }}" class="btn btn-secondary">
                Registrarse
            </a>
        </div>
    </div>
</body>
</html>