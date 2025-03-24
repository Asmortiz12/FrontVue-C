<template>
    <div class="users-container">
      <Toast />
      
      <div class="card">
        <div class="card-header">
          <h1 class="header-title">Gestión de Usuarios</h1>
          <div class="header-actions">
            <Button icon="pi pi-plus" label="Nuevo Usuario" class="p-button-success mr-2" @click="navigateToForm" />
            <Button icon="pi pi-refresh" class="p-button-outlined" @click="refreshData" :loading="loading" />
          </div>
        </div>
        
        <div class="search-container">
          <span class="p-input-icon-left w-full">
            <i class="pi pi-search" />
            <InputText v-model="globalFilter" placeholder="Buscar usuario..." class="search-input" @input="onGlobalFilterChange" />
          </span>
        </div>
        
        <DataTable 
          :value="Users" 
          :paginator="true" 
          :rows="10"
          :rowsPerPageOptions="[5, 10, 25, 50]"
          :loading="loading"
          v-model:filters="filters"
          filterDisplay="menu"
          responsiveLayout="stack"
          breakpoint="960px"
          stripedRows
          v-model:selection="selectedUsers"
          dataKey="id"
          class="p-datatable-sm"
        >
          <template #empty>
            <div class="text-center p-4">No se encontraron usuarios.</div>
          </template>
          
          <template #loading>
            <div class="text-center p-4">Cargando datos de usuarios...</div>
          </template>
          
          <Column selectionMode="multiple" headerStyle="width: 3rem" :exportable="false"></Column>
          
          <Column field="id" header="ID" sortable style="min-width: 5rem">
            <template #body="{ data }">
              <Badge :value="data.id" severity="info" />
            </template>
            <template #filter="{ filterModel }">
              <InputNumber v-model="filterModel.value" @change="applyFilterGlobal" placeholder="Buscar por ID" class="p-column-filter w-full" />
            </template>
          </Column>
          
          <Column field="name" header="Nombre" sortable style="min-width: 14rem">
            <template #body="{ data }">
              <div class="flex align-items-center">
                <Avatar :label="getInitials(data.name)" shape="circle" :style="{ 'background-color': getAvatarColor(data.id) }" class="mr-2" />
                <span>{{ data.name }}</span>
              </div>
            </template>
            <template #filter="{ filterModel }">
              <InputText v-model="filterModel.value" @input="applyFilterGlobal" placeholder="Buscar por nombre" class="p-column-filter w-full" />
            </template>
          </Column>
          
          <Column field="email" header="Email" sortable style="min-width: 14rem">
            <template #body="{ data }">
              <div class="flex align-items-center">
                <i class="pi pi-envelope mr-2 text-primary"></i>
                <span>{{ data.email }}</span>
              </div>
            </template>
            <template #filter="{ filterModel }">
              <InputText v-model="filterModel.value" @input="applyFilterGlobal" placeholder="Buscar por email" class="p-column-filter w-full" />
            </template>
          </Column>
          
          <Column field="telefone" header="Teléfono" sortable style="min-width: 10rem">
            <template #body="{ data }">
              <div class="flex align-items-center">
                <i class="pi pi-phone mr-2 text-success"></i>
                <span>{{ data.telefone }}</span>
              </div>
            </template>
            <template #filter="{ filterModel }">
              <InputText v-model="filterModel.value" @input="applyFilterGlobal" placeholder="Buscar por teléfono" class="p-column-filter w-full" />
            </template>
          </Column>
          
          <Column field="role" header="Rol" sortable style="min-width: 8rem">
            <template #body="{ data }">
              <Tag :value="data.role === 1 ? 'Administrador' : 'Cliente'" 
                   :severity="data.role === 1 ? 'warning' : 'info'" />
            </template>
            <template #filter="{ filterModel }">
              <Dropdown v-model="filterModel.value" @change="applyFilterGlobal"
                        :options="roleOptions" placeholder="Seleccionar rol"
                        class="p-column-filter w-full" />
            </template>
          </Column>
          
          <Column header="Acciones" :exportable="false" style="min-width: 12rem">
            <template #body="{ data }">
              <div class="action-buttons">
                <Button icon="pi pi-pencil" class="p-button-rounded p-button-success mr-2 p-button-sm" 
                        @click="editUser(data)" />
                <Button icon="pi pi-trash" class="p-button-rounded p-button-danger p-button-sm" 
                        @click="confirmDelete(data)" />
              </div>
            </template>
          </Column>
        </DataTable>
        
        <!-- Diálogo de confirmación para eliminar usuario -->
        <Dialog v-model:visible="deleteDialog" header="Confirmar eliminación" :style="{width: '450px'}" :modal="true">
          <div class="confirmation-content">
            <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem; color: #ff9800;" />
            <span v-if="selectedUser">¿Está seguro de eliminar a <b>{{ selectedUser.name }}</b>?</span>
          </div>
          <template #footer>
            <Button label="Cancelar" icon="pi pi-times" class="p-button-text" @click="deleteDialog = false" />
            <Button label="Eliminar" icon="pi pi-trash" class="p-button-danger" @click="deleteSelectedUser" :loading="deleting" />
          </template>
        </Dialog>
        
        <!-- Diálogo para editar usuario -->
        <Dialog v-model:visible="editDialog" header="Editar Usuario" :style="{width: '450px'}" :modal="true">
          <div class="p-fluid">
            <div class="field">
              <label for="edit-name">Nombre</label>
              <InputText id="edit-name" v-model="editingUser.name" required autofocus class="p-inputtext-sm" />
            </div>
            <div class="field">
              <label for="edit-email">Email</label>
              <InputText id="edit-email" v-model="editingUser.email" required type="email" class="p-inputtext-sm" />
            </div>
            <div class="field">
              <label for="edit-telefone">Teléfono</label>
              <InputText id="edit-telefone" v-model="editingUser.telefone" required class="p-inputtext-sm" />
            </div>
            <div class="field">
              <label for="edit-role">Rol</label>
              <Dropdown id="edit-role" v-model="editingUser.role" :options="roleOptions" optionLabel="label" optionValue="value" class="p-inputtext-sm" />
            </div>
          </div>
          <template #footer>
            <Button label="Cancelar" icon="pi pi-times" class="p-button-text" @click="editDialog = false" />
            <Button label="Guardar" icon="pi pi-check" class="p-button-primary" @click="saveUser" :loading="saving" />
          </template>
        </Dialog>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, onMounted, reactive, watch } from 'vue';
  import { useRouter } from 'vue-router';
  import { useToast } from 'primevue/usetoast';
  import { FilterMatchMode, FilterOperator } from 'primevue/api';
  import axios from 'axios';
  import DataTable from 'primevue/datatable';
  import Column from 'primevue/column';
  import Button from 'primevue/button';
  import InputText from 'primevue/inputtext';
  import InputNumber from 'primevue/inputnumber';
  import Dialog from 'primevue/dialog';
  import Dropdown from 'primevue/dropdown';
  import Tag from 'primevue/tag';
  import Badge from 'primevue/badge';
  import Avatar from 'primevue/avatar';
  import Toast from 'primevue/toast';
  
  export default {
    name: 'AboutView',
    components: {
      DataTable,
      Column,
      Button,
      InputText,
      InputNumber,
      Dialog,
      Dropdown,
      Tag,
      Badge,
      Avatar,
      Toast
    },
    setup() {
      const router = useRouter();
      const toast = useToast();
      const Users = ref([]);
      const loading = ref(false);
      const selectedUsers = ref([]);
      const selectedUser = ref(null);
      const deleteDialog = ref(false);
      const editDialog = ref(false);
      const deleting = ref(false);
      const saving = ref(false);
      const editingUser = ref({});
      const globalFilter = ref('');
      
      // Opciones para el filtro de rol
      const roleOptions = [
        { label: 'Cliente', value: 0 },
        { label: 'Administrador', value: 1 }
      ];
      
      // Configuración de filtros mejorada
      const filters = ref({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        id: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
        name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        email: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
        telefone: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
        role: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] }
      });
      
      // Manejar cambios en el filtro global
      const onGlobalFilterChange = () => {
        filters.value.global.value = globalFilter.value;
      };
      
      // Aplicar filtro global
      const applyFilterGlobal = () => {
        // Este método se llama cuando cambia cualquier filtro de columna
        // No necesita hacer nada específico ya que DataTable maneja los filtros automáticamente
      };
      
      // Obtener datos de usuarios
      const ListarUser = async () => {
        try {
          loading.value = true;
          const response = await axios.get("http://localhost:5151/api/Client");
          Users.value = response.data;
          loading.value = false;
        } catch (error) {
          console.log("Error desde el api", error);
          toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los usuarios', life: 3000 });
          loading.value = false;
        }
      };
      
      // Eliminar usuario
      const deleteUser = async (id) => {
        try {
          deleting.value = true;
          await axios.delete(`http://localhost:5151/api/Client/${id}`);
          await ListarUser();
          toast.add({ severity: 'success', summary: 'Éxito', detail: 'Usuario eliminado correctamente', life: 3000 });
          deleteDialog.value = false;
        } catch (error) {
          console.log("Error al eliminar el usuario", error);
          toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar el usuario', life: 3000 });
        } finally {
          deleting.value = false;
        }
      };
      
      // Confirmar eliminación
      const confirmDelete = (user) => {
        selectedUser.value = user;
        deleteDialog.value = true;
      };
      
      // Eliminar usuario seleccionado
      const deleteSelectedUser = () => {
        if (selectedUser.value) {
          deleteUser(selectedUser.value.id);
        }
      };
      
      // Editar usuario
      const editUser = (user) => {
        editingUser.value = { ...user };
        editDialog.value = true;
      };
      
      // Guardar cambios de usuario
      const saveUser = async () => {
        try {
          saving.value = true;
          await axios.put(`http://localhost:5151/api/Client/${editingUser.value.id}`, editingUser.value);
          await ListarUser();
          toast.add({ severity: 'success', summary: 'Éxito', detail: 'Usuario actualizado correctamente', life: 3000 });
          editDialog.value = false;
        } catch (error) {
          console.error("Error al actualizar el usuario", error);
          toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo actualizar el usuario', life: 3000 });
        } finally {
          saving.value = false;
        }
      };
      
      // Refrescar datos
      const refreshData = () => {
        ListarUser();
      };
      
      // Navegar al formulario de creación
      const navigateToForm = () => {
        router.push('/form');
      };
      
      // Funciones de utilidad
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
      
      onMounted(() => {
        ListarUser();
      });
      
      return {
        Users,
        loading,
        selectedUsers,
        selectedUser,
        deleteDialog,
        editDialog,
        deleting,
        saving,
        editingUser,
        roleOptions,
        filters,
        globalFilter,
        ListarUser,
        deleteUser,
        confirmDelete,
        deleteSelectedUser,
        editUser,
        saveUser,
        refreshData,
        navigateToForm,
        getInitials,
        getAvatarColor,
      onGlobalFilterChange,
      applyFilterGlobal
    };
  }
};
</script>

<style scoped>
.users-container {
  padding: 1.5rem;
}

.card {
  background: #ffffff;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.header-title {
  margin: 0;
  font-size: 1.5rem;
  color: #2c3e50;
}

.header-actions {
  display: flex;
  gap: 0.5rem;
}

.search-container {
  margin-bottom: 1rem;
  width: 100%;
}

.search-input {
  width: 100%;
  max-width: 100%;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
}

:deep(.p-datatable) {
  border-radius: 8px;
  overflow: hidden;
}

:deep(.p-datatable .p-datatable-header) {
  background: #f8f9fa;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
}

:deep(.p-datatable .p-datatable-thead > tr > th) {
  background: #f8f9fa;
  color: #495057;
  font-weight: 600;
  padding: 0.75rem 1rem;
}

:deep(.p-datatable .p-datatable-tbody > tr) {
  transition: background-color 0.2s;
}

:deep(.p-datatable .p-datatable-tbody > tr:hover) {
  background: #f1f5f9;
}

:deep(.p-button) {
  border-radius: 8px;
}

:deep(.p-button.p-button-sm) {
  padding: 0.4rem 0.4rem;
}

:deep(.p-dialog .p-dialog-header) {
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
}

:deep(.p-dialog .p-dialog-content) {
  padding: 1.5rem;
}

.confirmation-content {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem 0;
}

.field {
  margin-bottom: 1.5rem;
}

.field label {
  font-weight: 600;
  margin-bottom: 0.5rem;
  display: block;
}

/* Estilos responsivos */
@media screen and (max-width: 768px) {
  .users-container {
    padding: 1rem;
  }
  
  .card {
    padding: 1rem;
  }
  
  .card-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .header-actions {
    width: 100%;
    justify-content: space-between;
  }
  
  :deep(.p-datatable .p-datatable-thead > tr > th) {
    padding: 0.5rem;
  }
  
  :deep(.p-datatable .p-datatable-tbody > tr > td) {
    padding: 0.5rem;
  }
}

@media screen and (max-width: 576px) {
  :deep(.p-datatable-wrapper) {
    overflow-x: auto;
  }
}
</style>
