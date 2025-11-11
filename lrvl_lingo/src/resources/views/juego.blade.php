




        <!--METER PAGINA INICIO LINGO AQUÍ-->
        <!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Lingo</title>
    <link rel="stylesheet" href="{{ asset('../css/style.css') }}" />
    <link rel="stylesheet" href="{{ asset('../css/nav.css') }}" />
    <link rel="stylesheet" href="{{ asset('../css/footer.css') }}" />
    <link rel="stylesheet" href="{{ asset('../css/lingo.css') }}" />
    <link rel="stylesheet" href="{{ asset('../css/vistaMovil.css') }}" />
    <link rel="stylesheet" href="{{ asset('../css/vistaTablet.css') }}" />
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
                <a href="/ranking">Ranking</a>
                
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
    <div class="contenedor-juego">
      <div class="Juego-columna">
        <div id="mensaje-lingo">
          <div id="textoFinal" class="textoFinal"></div>
          <div id="contador-general" class="contador">00:00</div>
        </div>

        <div id="tabla"></div>
        <div id="teclado"></div>
      </div>

      <section class="aside">
        <ul class="instrucciones">
          <li id="textoW/L">
            Tienes <span id="temporizador-fila"></span> segundos por cada fila
            para escribir una palabra.
          </li>
          <li><span id="verde">Verde</span> = Letra correcta.</li>
          <li><span id="amarilla">Amarillo</span> = Letra mal colocada.</li>
          <li><span id="gris">Gris</span> = Letra incorrecta.</li>
        </ul>
      </section>
    </div>

    <footer class="footer">
      <p>© 2025 Lingo. Todos los derechos reservados.</p>
    </footer>
    <script src="{{asset('../js/diccionario.js') }}"></script>
    <script src="{{ asset('../js/lingo.js') }}"></script>

    </body>
</html>
