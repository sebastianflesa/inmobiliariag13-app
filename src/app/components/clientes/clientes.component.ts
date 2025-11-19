import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { ClienteService } from '../../services/cliente.service';

interface Cliente {
  rut: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
}

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [CommonModule, HttpClientModule, ReactiveFormsModule, FormsModule],
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
export class ClientesComponent implements OnInit {
  clientes: Cliente[] = [];
  isLoading = false;
  errorMessage: string | null = null;
  clienteForm = new FormGroup({
    rut: new FormControl('', [Validators.required, Validators.pattern(/^[0-9]{7,8}-[0-9kK]{1}$/)]),
    nombre: new FormControl('', Validators.required),
    apellido: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    telefono: new FormControl('', [Validators.required, Validators.pattern(/^[0-9]{9}$/)])
  });
  mostrarFormulario = false;
  clienteCreado = false;
  clienteEditado = false;
  clienteSeleccionado: any = null;
  modoEdicion = false;

  constructor(private clienteService: ClienteService) { }

  mostrarFormularioCrear(): void {
    this.mostrarFormulario = true;
    this.modoEdicion = false;
    this.clienteForm.reset();
  }

  ngOnInit(): void {
    this.loadClientes();
  }

  private loadClientes(onSuccess?: () => void): void {
    this.isLoading = true;
    this.errorMessage = null;
    this.clienteService.getClientes()
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (response: any) => {
          console.log('Clientes obtenidos:', response);
          this.clientes = response.data;
          onSuccess?.();
        },
        error: (error: any) => {
          console.error('Error al obtener clientes:', error);
          this.errorMessage = 'No se pudieron cargar los clientes. Intenta nuevamente.';
        }
      });
  }

  crearCliente(): void {
    if (this.clienteForm.valid) {
      const cliente = this.clienteForm.value as Cliente;
      if (this.modoEdicion) {
        this.clienteService.editarCliente(this.clienteSeleccionado.id, cliente).subscribe({
          next: (response: any) => {
            console.log(response);
            this.loadClientes(() => {
              this.clienteForm.reset();
              this.mostrarFormulario = false;
              this.clienteEditado = true;
              setTimeout(() => {
                this.clienteEditado = false;
              }, 2000);
            });
          },
          error: (error: any) => {
            console.error(error);
            this.errorMessage = 'No se pudo editar el cliente. Intenta nuevamente.';
          }
        });
      } else {
        this.clienteService.crearCliente(cliente).subscribe({
          next: (response: any) => {
            console.log(response);
            this.loadClientes(() => {
              this.clienteForm.reset();
              this.mostrarFormulario = false;
              this.clienteCreado = true;
              setTimeout(() => {
                this.clienteCreado = false;
              }, 2000);
            });
          },
          error: (error: any) => {
            console.error(error);
            this.errorMessage = 'No se pudo crear el cliente. Intenta nuevamente.';
          }
        });
      }
    } else {
      this.clienteForm.markAllAsTouched();
    }
  }

  editarCliente(cliente: any): void {
    this.mostrarFormulario = true;
    this.modoEdicion = true;
    this.clienteSeleccionado = cliente;
    this.clienteForm.patchValue({
      rut: cliente.rut,
      nombre: cliente.nombre,
      apellido: cliente.apellido,
      email: cliente.email,
      telefono: cliente.telefono
    });
  }

  eliminarCliente(cliente: any): void {
    this.clienteService.eliminarCliente(cliente.id).subscribe({
      next: () => this.loadClientes(),
      error: (error) => {
        console.error(error);
        this.errorMessage = 'No se pudo eliminar el cliente. Intenta nuevamente.';
      }
    });
  }

  rutBuscar = '';

  /*buscarCliente(): void {
    if (this.rutBuscar) {
      this.clienteService.getClientePorRut(this.rutBuscar).subscribe({
        next: (response: any) => {
          console.log(response);
          if (response) {
            this.clientes = [response];
          } else {
            this.clientes = [];
          }
        },
        error: (error: any) => {
          console.error(error);
          this.clientes = [];
        }
      });
    } else {
      this.clienteService.getClientes().subscribe((response: any) => {
        console.log(response);
        this.clientes = response.data;
      });
    }
  }
    */
}
