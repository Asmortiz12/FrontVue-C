<template>
  <div class="navbar">
    <div class="navbar-brand">
      <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="30" height="30" />
      <h1 class="app-name">Vue Admin</h1>
    </div>
    <div class="navbar-menu">
      <router-link to="/" class="nav-link">Dashboard</router-link>
      <router-link to="/about" class="nav-link">Usuarios</router-link>
      <router-link to="/form" class="nav-link">Nuevo Usuario</router-link>
    </div>
    <div class="navbar-actions">
      <button class="nav-button">
        <i class="pi pi-user"></i>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Navbar'
}
</script>

<style scoped>
.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1.5rem;
  background-color: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.navbar-brand {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.logo {
  height: 30px;
  width: 30px;
}

.app-name {
  font-size: 1.25rem;
  font-weight: 600;
  color: #41b883;
  margin: 0;
}

.navbar-menu {
  display: flex;
  gap: 1.5rem;
}

.nav-link {
  color: #2c3e50;
  text-decoration: none;
  font-weight: 500;
  padding: 0.5rem 0;
  position: relative;
}

.nav-link:hover {
  color: #41b883;
}

.nav-link.router-link-active {
  color: #41b883;
}

.nav-link.router-link-active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: #41b883;
}

.navbar-actions {
  display: flex;
  align-items: center;
}

.nav-button {
  background: none;
  border: none;
  cursor: pointer;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #2c3e50;
}

.nav-button:hover {
  background-color: #f1f5f9;
  color: #41b883;
}

@media screen and (max-width: 768px) {
  .navbar {
    padding: 0.75rem 1rem;
  }
  
  .app-name {
    display: none;
  }
  
  .navbar-menu {
    gap: 1rem;
  }
}

@media screen and (max-width: 576px) {
  .navbar-menu {
    display: none;
  }
}
</style>
