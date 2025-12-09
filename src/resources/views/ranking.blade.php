<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ranking - Lingo</title>
    
    <link rel="stylesheet" href="{{ asset('css/style.css') }}" />
    <link rel="stylesheet" href="{{ asset('css/nav.css') }}" />
    <link rel="stylesheet" href="{{ asset('css/footer.css') }}" />
    
    <link rel="stylesheet" href="{{ asset('css/ranking.css') }}" />
</head>
<body>

    <nav class="navbar">
      <div class="logo-container">
        <img src="{{ asset('/img/Lingo.png') }}" alt="Lingo logo" class="logo" />
        <h1>Lingo</h1>
      </div>
      <div class="nav-links">
        
        <a href="/juego">Inicio</a>

        @auth
            
            <a href="{{ route('ranking') }}" class="activo">Ranking</a>

            <div class="dropdown">
                <button class="dropdown-toggle">{{ auth()->user()->name }}</button>
                <div class="dropdown-menu">
                    <form method="POST" action="{{ route('logout') }}">
                        @csrf
                        <a href="{{ route('logout') }}" onclick="event.preventDefault(); this.closest('form').submit();">
                            Cerrar sesión
                        </a>
                    </form>
                </div>
            </div>
        @elseguest
            <a href="{{ route('ranking') }}" class="activo">Ranking</a>
            <a href="{{ route('login') }}">Iniciar sesion</a>
        @endguest
      </div>
    </nav>

    
    <div class="ranking-container">
        <h1>Ranking de Jugadores</h1>
        
        <table class="ranking-table">
            <thead>
                <tr>
                    <th>Posición</th>
                    <th>Nombre</th>
                    <th>Puntuación</th>
                </tr>
            </thead>
            <tbody>
                @foreach ($usuarios as $index => $user)
                    <tr>
                        <td class="posicion">{{ $index + 1 }}</td>
                        <td class="nombre">{{ $user->name }}</td>
                        <td class="puntuacion">{{ $user->score }}</td>
                    </tr>
                @endforeach
            </tbody>
        </table>

        <a href="/juego" class="back-link">Volver al juego</a>
    </div>


    <footer class="footer">
      <p>© 2025 Lingo. Todos los derechos reservados.</p>
    </footer>

</body>
</html>