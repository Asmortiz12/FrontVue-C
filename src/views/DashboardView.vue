<template>
  <div class="dashboard">
    <Toast />
    
    <div class="dashboard-header">
      <h1>Dashboard</h1>
      <p>Resumen de datos del sistema</p>
    </div>
    
    <div class="stats-container">
      <div class="stat-card">
        <div class="stat-icon">
          <i class="pi pi-users"></i>
        </div>
        <div class="stat-content">
          <h3>Total Usuarios</h3>
          <p class="stat-value">{{ loading ? 'Cargando...' : totalUsers }}</p>
          <p class="stat-info">Usuarios registrados en el sistema</p>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon">
          <i class="pi pi-user-plus"></i>
        </div>
        <div class="stat-content">
          <h3>Administradores</h3>
          <p class="stat-value">{{ loading ? 'Cargando...' : adminCount }}</p>
          <p class="stat-info">Usuarios con rol de administrador</p>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon">
          <i class="pi pi-users"></i>
        </div>
        <div class="stat-content">
          <h3>Clientes</h3>
          <p class="stat-value">{{ loading ? 'Cargando...' : clientCount }}</p>
          <p class="stat-info">Usuarios con rol de cliente</p>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon">
          <i class="pi pi-envelope"></i>
        </div>
        <div class="stat-content">
          <h3>Dominios de Email</h3>
          <p class="stat-value">{{ loading ? 'Cargando...' : uniqueEmailDomains.length }}</p>
          <p class="stat-info">Dominios de correo únicos</p>
        </div>
      </div>
    </div>
    
    <div class="dashboard-content">
      <div class="chart-container">
        <div class="chart-header">
          <h2>Distribución de Usuarios</h2>
          <Button icon="pi pi-refresh" class="p-button-text p-button-sm" @click="fetchData" :loading="loading" />
        </div>
        <div class="chart-content">
          <div class="role-distribution">
            <div class="role-bar-container">
              <div class="role-bar admin" :style="{ width: adminPercentage + '%' }">
                {{ adminPercentage }}%
              </div>
              <div class="role-bar client" :style="{ width: clientPercentage + '%' }">
                {{ clientPercentage }}%
              </div>
            </div>
            <div class="role-legend">
              <div class="legend-item">
                <div class="legend-color admin"></div>
                <span>Administradores</span>
              </div>
              <div class="legend-item">
                <div class="legend-color client"></div>
                <span>Clientes</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="recent-users">
        <h2>Usuarios Recientes</h2>
        <div v-if="loading" class="loading-container">
          <i class="pi pi-spin pi-spinner" style="font-size: 2rem"></i>
          <p>Cargando usuarios...</p>
        </div>
        <div v-else class="user-list">
          <div v-for="user in recentUsers" :key="user.id" class="user-item">
            <div class="user-avatar" :style="{ backgroundColor: getAvatarColor(user.id) }">
              {{ getInitials(user.name) }}
            </div>
            <div class="user-details">
              <p class="user-name">{{ user.name }}</p>
              <p class="user-email">{{ user.email }}</p>
            </div>
            <Tag :value="user.role === 1 ? 'Admin' : 'Cliente'" 
                 :severity="user.role === 1 ? 'warning' : 'info'" />
          </div>
          <Button label="Ver todos los usuarios" icon="pi pi-users" class="p-button-text" @click="navigateToUsers" />
        </div>
      </div>
    </div>
    
    <div class="email-domains-section">
      <h2>Dominios de Email Populares</h2>
      <div class="domains-container">
        <div v-for="(count, domain) in emailDomainCounts" :key="domain" class="domain-item">
          <div class="domain-name">{{ domain }}</div>
          <div class="domain-count">{{ count }} usuario{{ count !== 1 ? 's' : '' }}</div>
          <div class="domain-bar" :style="{ width: (count / totalUsers * 100) + '%' }"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import axios from 'axios';

// Reactive state
const users = ref([]);
const loading = ref(true);
const toast = useToast();
const router = useRouter();

// Computed properties
const totalUsers = computed(() => users.value.length);

const adminCount = computed(() => 
  users.value.filter(user => user.role === 1).length
);

const clientCount = computed(() => 
  users.value.filter(user => user.role === 0).length
);

const adminPercentage = computed(() => {
  if (totalUsers.value === 0) return 0;
  return Math.round((adminCount.value / totalUsers.value) * 100);
});

const clientPercentage = computed(() => {
  if (totalUsers.value === 0) return 0;
  return Math.round((clientCount.value / totalUsers.value) * 100);
});

const recentUsers = computed(() => {
  return [...users.value].sort((a, b) => b.id - a.id).slice(0, 5);
});

const uniqueEmailDomains = computed(() => {
  const domains = users.value.map(user => {
    const email = user.email || '';
    return email.split('@')[1];
  }).filter(Boolean);
  
  return [...new Set(domains)];
});

const emailDomainCounts = computed(() => {
  const counts = {};
  
  users.value.forEach(user => {
    const email = user.email || '';
    const domain = email.split('@')[1];
    
    if (domain) {
      counts[domain] = (counts[domain] || 0) + 1;
    }
  });
  
  // Ordenar por cantidad (de mayor a menor)
  const sortedEntries = Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5); // Mostrar solo los 5 más populares
  
  return Object.fromEntries(sortedEntries);
});

// Methods
const fetchData = async () => {
  try {
    loading.value = true;
    const response = await axios.get("http://localhost:5151/api/Client");
    users.value = response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    toast.add({ 
      severity: 'error', 
      summary: 'Error', 
      detail: 'No se pudieron cargar los datos de usuarios', 
      life: 3000 
    });
  } finally {
    loading.value = false;
  }
};

const getInitials = (name) => {
  if (!name) return 'U';
  return name.split(' ')
    .map(part => part.charAt(0))
    .join('')
    .toUpperCase()
    .substring(0, 2);
};

const getAvatarColor = (id) => {
  const colors = ['#2196F3', '#4CAF50', '#FF9800', '#E91E63', '#9C27B0'];
  return colors[id % colors.length];
};

const navigateToUsers = () => {
  router.push('/about');
};

// Lifecycle hooks
onMounted(() => {
  fetchData();
});
</script>

<style scoped>
.dashboard {
  padding: 20px;
  max-width: 100%;
}

.dashboard-header {
  margin-bottom: 24px;
}

.dashboard-header h1 {
  font-size: 24px;
  margin-bottom: 8px;
  color: #2c3e50;
}

.dashboard-header p {
  color: #64748b;
  font-size: 16px;
}

/* Contenedor de estadísticas */
.stats-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 20px;
  margin-bottom: 24px;
}

.stat-card {
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  transition: transform 0.2s, box-shadow 0.2s;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.stat-icon {
  background-color: #f0f9ff;
  color: #41b883;
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
  font-size: 20px;
}

.stat-content {
  flex: 1;
}

.stat-content h3 {
  font-size: 14px;
  color: #64748b;
  margin: 0 0 8px 0;
  font-weight: 500;
}

.stat-value {
  font-size: 24px;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 4px 0;
}

.stat-info {
  font-size: 12px;
  margin: 0;
  color: #64748b;
}

/* Contenido principal del dashboard */
.dashboard-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 24px;
}

.chart-container, .recent-users {
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.chart-header h2, .recent-users h2, .email-domains-section h2 {
  font-size: 18px;
  margin: 0;
  color: #2c3e50;
}

.chart-content {
  padding: 20px 0;
}

.role-distribution {
  margin-top: 20px;
}

.role-bar-container {
  height: 40px;
  display: flex;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 16px;
}

.role-bar {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  transition: width 0.5s ease;
}

.role-bar.admin {
  background-color: #ff9800;
}

.role-bar.client {
  background-color: #2196f3;
}

.role-legend {
  display: flex;
  gap: 20px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.legend-color {
  width: 16px;
  height: 16px;
  border-radius: 4px;
}

.legend-color.admin {
  background-color: #ff9800;
}

.legend-color.client {
  background-color: #2196f3;
}

.user-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.user-item {
  display: flex;
  align-items: center;
  padding: 12px;
  border-radius: 8px;
  background-color: #f8fafc;
  transition: background-color 0.2s;
}

.user-item:hover {
  background-color: #f1f5f9;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  margin-right: 12px;
}

.user-details {
  flex: 1;
}

.user-name {
  font-weight: 600;
  margin: 0 0 4px 0;
  color: #2c3e50;
}

.user-email {
  font-size: 12px;
  margin: 0;
  color: #64748b;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 0;
  color: #64748b;
  gap: 16px;
}

.email-domains-section {
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  margin-bottom: 24px;
}

.domains-container {
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.domain-item {
  position: relative;
  padding: 12px 16px;
  background-color: #f8fafc;
  border-radius: 8px;
  display: flex;
  align-items: center;
  overflow: hidden;
}

.domain-name {
  font-weight: 600;
  margin-right: 12px;
  z-index: 1;
}

.domain-count {
  margin-left: auto;
  font-size: 14px;
  color: #64748b;
  z-index: 1;
}

.domain-bar {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  background-color: rgba(65, 184, 131, 0.1);
  transition: width 0.5s ease;
}

/* Estilos responsivos */
@media (max-width: 992px) {
  .dashboard-content {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .stats-container {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 576px) {
  .stats-container {
    grid-template-columns: 1fr;
  }
  
  .role-bar {
    font-size: 12px;
  }
  
  .user-item {
    flex-wrap: wrap;
  }
  
  .user-avatar {
    margin-bottom: 8px;
  }
}
</style>

