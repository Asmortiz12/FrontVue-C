<template>
  <div class="app-container">
    <Navbar />
    <main class="main-content">
      <router-view />
    </main>
    <footer class="app-footer">
      <div class="footer-content">
        <span>© 2023 Vue Admin</span>
      </div>
    </footer>
  </div>
</template>

<script>
import Navbar from '@/components/Navbar.vue';

export default {
  name: 'App',
  components: {
    Navbar
  }
}
</script>

<style scoped>
/* Estilos básicos para restablecer y normalizar */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  height: 100%;
  width: 100%;
  overflow-x: hidden;
}

body {
  font-family: Arial, Helvetica, sans-serif;
  background-color: #f5f7fa;
  color: #2c3e50;
  line-height: 1.6;
}

/* Estructura principal de la aplicación */
.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh; /* Asegura que ocupe al menos toda la altura de la ventana */
}

.main-content {
  flex: 1; /* Hace que el contenido principal ocupe todo el espacio disponible */
  padding: 20px;
  width: 100%;
  max-width: 1400px;
  margin: 0 auto; /* Centra el contenido */
  position: relative;
}

/* Footer simple */
.app-footer {
  background-color: #ffffff;
  border-top: 1px solid #e2e8f0;
  padding: 15px 0;
  text-align: center;
  font-size: 14px;
  color: #64748b;
  width: 100%;
}

.footer-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
}

/* Estilos generales para componentes */
h1, h2, h3, h4, h5, h6 {
  margin-bottom: 16px;
  font-weight: 600;
  line-height: 1.2;
}

a {
  color: #41b883;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

/* Estilos responsivos */
@media screen and (max-width: 768px) {
  .main-content {
    padding: 15px;
  }
}

@media screen and (max-width: 576px) {
  .main-content {
    padding: 10px;
  }
}
</style>
