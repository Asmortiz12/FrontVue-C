<template>
  <div class="form-container">
    <Toast />
    
    <div class="card">
      <div class="card-header">
        <div class="flex align-items-center">
          <i class="pi pi-user-plus text-primary mr-2" style="font-size: 1.5rem;"></i>
          <h1 class="m-0">Crear Nuevo Usuario</h1>
        </div>
        <Button icon="pi pi-arrow-left" label="Volver" class="p-button-outlined" @click="goBack" />
      </div>
      
      <form @submit="submitForm" class="p-fluid">
        <div class="form-grid">
          <div class="field">
            <label for="id">ID (Auto-incrementable)</label>
            <InputText id="id" v-model="id" disabled class="p-inputtext-sm" />
            <small>Este campo se genera automáticamente</small>
          </div>
          
          <div class="field">
            <label for="name">Nombre <span class="text-danger">*</span></label>
            <span class="p-input-icon-left w-full">
              <i class="pi pi-user" />
              <InputText 
                id="name" 
                v-model="name" 
                placeholder="Ingrese el nombre completo" 
                required 
                class="p-inputtext-sm w-full"
                :class="{'p-invalid': submitted && !name}"
              />
            </span>
            <small v-if="submitted && !name" class="p-error">El nombre es requerido.</small>
            <small v-else>Ingrese el nombre completo del usuario.</small>
          </div>
          
          <div class="field">
            <label for="email">Email <span class="text-danger">*</span></label>
            <span class="p-input-icon-left w-full">
              <i class="pi pi-envelope" />
              <InputText 
                id="email" 
                v-model="email" 
                placeholder="ejemplo@correo.com" 
                type="email" 
                required 
                class="p-inputtext-sm w-full"
                :class="{'p-invalid': submitted && !email}"
              />
            </span>
            <small v-if="submitted && !email" class="p-error">El email es requerido.</small>
            <small v-else>Ingrese un email válido.</small>
          </div>
          
          <div class="field">
            <label for="telefone">Teléfono <span class="text-danger">*</span></label>
            <span class="p-input-icon-left w-full">
              <i class="pi pi-phone" />
              <InputText 
                id="telefone" 
                v-model="telefone" 
                placeholder="Ingrese el número de teléfono" 
                required 
                class="p-inputtext-sm w-full"
                :class="{'p-invalid': submitted && !telefone}"
              />
            </span>
            <small v-if="submitted && !telefone" class="p-error">El teléfono es requerido.</small>
            <small v-else>Formato recomendado: +XX XXX XXX XXX</small>
          </div>
          
          <div class="field">
            <label for="password">Contraseña <span class="text-danger">*</span></label>
            <Password 
              id="password" 
              v-model="password" 
              toggleMask 
              :feedback="true" 
              placeholder="Ingrese la contraseña" 
              required 
              class="p-inputtext-sm"
              :class="{'p-invalid': submitted && !password}"
              :promptLabel="'Ingrese una contraseña'"
              :weakLabel="'Débil'"
              :mediumLabel="'Media'"
              :strongLabel="'Fuerte'"
            />
            <small v-if="submitted && !password" class="p-error">La contraseña es requerida.</small>
            <small v-else>La contraseña debe tener al menos 8 caracteres.</small>
          </div>
          
          <div class="field">
            <label for="role">Rol <span class="text-danger">*</span></label>
            <Dropdown 
              id="role" 
              v-model="role" 
              :options="roles" 
              optionLabel="label" 
              optionValue="value"
              placeholder="Seleccione un rol" 
              class="p-inputtext-sm"
              :class="{'p-invalid': submitted && !role}"
            />
            <small v-if="submitted && !role" class="p-error">El rol es requerido.</small>
            <small v-else>Seleccione el tipo de usuario.</small>
          </div>
        </div>
        
        <div class="form-actions">
          <Button 
            type="button" 
            label="Cancelar" 
            icon="pi pi-times" 
            class="p-button-outlined p-button-secondary" 
            @click="resetForm"
          />
          <Button 
            type="submit" 
            label="Crear Usuario" 
            icon="pi pi-user-plus" 
            class="p-button-success" 
            :loading="loading" 
          />
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useToast } from 'primevue/usetoast';
import { useRouter } from 'vue-router';
import axios from 'axios';

export default {
  name: 'FormView',
  setup() {
    const toast = useToast();
    const router = useRouter();
    const name = ref('');
    const email = ref('');
    const telefone = ref('');
    const password = ref('');
    const role = ref('0'); // Default is Cliente
    const id = ref(0);
    const loading = ref(false);
    const submitted = ref(false);

    const roles = [
      { label: 'Cliente', value: '0' },
      { label: 'Administrador', value: '1' },
    ];

    const autoIncrementId = async () => {
      try {
        const response = await axios.get('http://localhost:5151/api/Client');
        const clientes = response.data;
        if (clientes.length > 0) {
          const maxId = Math.max(...clientes.map(cliente => cliente.id));
          id.value = maxId + 1;
        } else {
          id.value = 1; // Start from 1 if no data exists.
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo obtener el ID', life: 3000 });
      }
    };

    const submitForm = async (event) => {
      event.preventDefault();
      submitted.value = true;
      
      // Validación básica
      if (!name.value || !email.value || !telefone.value || !password.value) {
        toast.add({ severity: 'warn', summary: 'Advertencia', detail: 'Por favor complete todos los campos requeridos', life: 3000 });
        return;
      }
      
      loading.value = true;
      
      const newUser = {
        id: id.value,
        name: name.value,
        email: email.value,
        telefone: telefone.value,
        password: password.value,
        role: parseInt(role.value, 10), // Convert role back to a number
      };

      try {
        await axios.post('http://localhost:5151/api/Client', newUser);
        toast.add({ 
          severity: 'success', 
          summary: 'Usuario Creado', 
          detail: `El usuario ${name.value} ha sido creado exitosamente`, 
          life: 3000 
        });
        
        // Reset form after successful submission
        resetForm();
        submitted.value = false;
        await autoIncrementId(); // Update id field for the next user
      } catch (error) {
        console.error('Error creating user:', error);
        toast.add({ 
          severity: 'error', 
          summary: 'Error', 
          detail: 'Error al crear el usuario. Por favor intente nuevamente.', 
          life: 3000 
        });
      } finally {
        loading.value = false;
      }
    };
    
    const resetForm = () => {
      name.value = '';
      email.value = '';
      telefone.value = '';
      password.value = '';
      role.value = '0';
      submitted.value = false;
    };
    
    const goBack = () => {
      router.go(-1);
    };

    // Call autoIncrementId when the component is mounted
    onMounted(() => {
      autoIncrementId();
    });

    return {
      name,
      email,
      telefone,
      password,
      role,
      roles,
      id,
      loading,
      submitted,
      submitForm,
      resetForm,
      goBack
    };
  },
};
</script>

<style scoped>
.form-container {
  padding: 1.5rem;
  max-width: 800px;
  margin: 0 auto;
}

.card {
  background: #ffffff;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease;
}

.card:hover {
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e9ecef;
}

h1 {
  font-size: 1.5rem;
  color: #343a40;
  font-weight: 600;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
}

.field {
  margin-bottom: 1rem;
}

.field label {
  display: block;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #495057;
}

.text-danger {
  color: #dc3545;
}

small {
  display: block;
  margin-top: 0.25rem;
  color: #6c757d;
}

small.p-error {
  color: #dc3545;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e9ecef;
}

:deep(.p-inputtext) {
  border-radius: 8px;
  padding: 0.75rem;
  transition: box-shadow 0.2s, border-color 0.2s;
}

:deep(.p-inputtext:enabled:focus) {
  box-shadow: 0 0 0 2px #e6f7ff, 0 0 0 4px #1890ff40;
  border-color: #1890ff;
}

:deep(.p-dropdown) {
  border-radius: 8px;
}

:deep(.p-button) {
  border-radius: 8px;
  transition: background-color 0.2s, transform 0.1s;
}

:deep(.p-button:active) {
  transform: translateY(1px);
}

:deep(.p-password-panel) {
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

:deep(.p-password-meter) {
  margin-top: 0.5rem;
}

:deep(.p-password .p-password-input) {
  width: 100%;
}

:deep(.p-inputtext.p-invalid) {
  border-color: #dc3545;
}

/* Estilos responsivos */
@media screen and (max-width: 768px) {
  .form-container {
    padding: 1rem;
  }
  
  .card {
    padding: 1rem;
  }
  
  .form-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .card-header button {
    align-self: flex-start;
  }
  
  h1 {
    font-size: 1.25rem;
  }
  
  .form-actions {
    flex-direction: column-reverse;
    gap: 0.75rem;
  }
  
  .form-actions button {
    width: 100%;
  }
}

@media screen and (max-width: 576px) {
  .form-container {
    padding: 0.75rem;
  }
  
  .card {
    padding: 0.75rem;
    border-radius: 8px;
  }
  
  .field {
    margin-bottom: 0.75rem;
  }
  
  :deep(.p-inputtext),
  :deep(.p-dropdown) {
    font-size: 0.875rem;
  }
}
</style>
