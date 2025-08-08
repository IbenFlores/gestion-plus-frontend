import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TaskService } from '../../services/task.service';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';
import { AuthService } from '../../auth/auth.service';
import { Observable } from 'rxjs';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-create-task-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-task-modal.component.html',
  styleUrls: ['../project-detail/project-detail.component.css']
})
export class CreateTaskModalComponent implements OnInit {
  @Input() projectId!: number;
  @Input() projectStartDate!: string;
  @Input() projectEndDate!: string;
  @Input() existingTasks: Task[] = [];
  
  @Output() close = new EventEmitter<void>();
  @Output() taskCreated = new EventEmitter<void>();
  
  taskForm: FormGroup;
  users$!: Observable<User[]>;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private userService: UserService,
    private authService: AuthService
  ) {
    this.taskForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      assignedUserId: [null],
      priority: ['MEDIA', Validators.required],
      dependencyId: [null]
    });
  }

  ngOnInit(): void {
    const companyId = this.authService.getCompanyId();
    if (companyId) {
      this.users$ = this.userService.getUsersByCompanyId(companyId);
    }
  }

  onSubmit(): void {
    if (this.taskForm.valid) {
      const taskData = {
        ...this.taskForm.value,
        projectId: this.projectId,
        status: 'PENDIENTE',
        progress: 0
      };
      this.taskService.createTask(taskData).subscribe({
        next: () => {
          this.taskCreated.emit();
          this.close.emit();
        },
        error: (err) => {
          this.errorMessage = err.error?.message || 'Ocurrió un error al crear la tarea.';
        }
      });
    }
  }
}