<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Estadisticas!</title>
    <link rel="stylesheet" href="{{ asset('../css/style.css') }}" />
    <link rel="stylesheet" href="{{ asset('../css/nav.css') }}" />
    <link rel="stylesheet" href="{{ asset('../css/footer.css') }}" />
    <link rel="stylesheet" href="{{ asset('../css/lingo.css') }}" />
    <link rel="stylesheet" href="{{ asset('../css/vistaMovil.css') }}" />
    <link rel="stylesheet" href="{{ asset('../css/teclado.css') }}" />
  </head>
  <body>
<nav class="navbar">
      <div class="logo-container">
        <img src="{{ asset('/img/Lingo.png') }}" alt="Lingo logo" class="logo" />
        <h1>Lingo</h1>
      </div>
<div class="nav-links">
    
    <a href="/juego" class="activo">Inicio</a>

    @auth
        <div class="dropdown">
            
            <button class="dropdown-toggle">
                {{ auth()->user()->name }}
            </button>

            <div class="dropdown-menu">
                <a href="/perfil">Perfil</a>
                <a href="/estadisticas">Ranking</a>
                
                <form method="POST" action="{{ route('logout') }}">
                    @csrf
                    <a href="{{ route('logout') }}"
                       onclick="event.preventDefault(); this.closest('form').submit();">
                        Cerrar sesión
                    </a>
                </form>
            </div>
        </div>

    @elseguest
        <a href="/perfil">Perfil</a>
        <a href="/estadisticas">Estadísticas</a>
        <a href="{{ route('login') }}">Iniciar sesion</a>
    @endguest

</div>
    </nav>

    <footer>
        Footer
    </footer>
  </body>
</html>
