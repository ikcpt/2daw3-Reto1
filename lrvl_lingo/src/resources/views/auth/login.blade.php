<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Iniciar Sesión</title>
    <link rel="stylesheet" href="{{ asset('css/auth-style.css') }}">
</head>
<body>
    <div class="auth-container">
        <form method="POST" action="{{ route('login') }}">
            @csrf
            <h2>Iniciar Sesión</h2>

            <div class="form-group">
                <label for="email">Email</label>
                <input id="email" type="email" name="email" value="{{ old('email') }}" required autofocus>
                @error('email') <span class="error-message">{{ $message }}</span> @enderror
            </div>

            <div class="form-group">
                <label for="password">Contraseña</label>
                <input id="password" type="password" name="password" required>
                @error('password') <span class="error-message">{{ $message }}</span> @enderror
            </div>
            
            <div class="form-group-remember">
                <label for="remember">
                    <input id="remember" type="checkbox" name="remember">
                    <span>Recordarme</span>
                </label>
            </div>

            <div class="form-footer">
                <a href="{{ route('register') }}">¿No tienes cuenta? Regístrate</a>
                <button type="submit" class="btn">Entrar</button>
            </div>
        </form>
    </div>
</body>
</html>