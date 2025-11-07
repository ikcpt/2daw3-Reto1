<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Registro</title>
    <link rel="stylesheet" href="{{ asset('css/auth-style.css') }}">
</head>
<body>
    <div class="auth-container">
        <form method="POST" action="{{ route('register') }}">
            @csrf
            <h2>Crear Cuenta</h2>

            <div class="form-group">
                <label for="name">Nombre</label>
                <input id="name" type="text" name="name" value="{{ old('name') }}" required autofocus>
                @error('name') <span class="error-message">{{ $message }}</span> @enderror
            </div>

            <div class="form-group">
                <label for="email">Email</label>
                <input id="email" type="email" name="email" value="{{ old('email') }}" required>
                @error('email') <span class="error-message">{{ $message }}</span> @enderror
            </div>

            <div class="form-group">
                <label for="password">Contraseña</label>
                <input id="password" type="password" name="password" required>
                @error('password') <span class="error-message">{{ $message }}</span> @enderror
            </div>

            <div class="form-group">
                <label for="password_confirmation">Confirmar Contraseña</label>
                <input id="password_confirmation" type="password" name="password_confirmation" required>
            </div>

            <div class="form-footer">
                <a href="{{ route('login') }}">¿Ya tienes cuenta?</a>
                <button type="submit" class="btn">Registrarse</button>
            </div>
        </form>
    </div>
</body>
</html>