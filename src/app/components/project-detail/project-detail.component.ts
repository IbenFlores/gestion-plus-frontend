import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProjectService } from '../../services/project.service';
import { TaskService } from '../../services/task.service';
import { TaskDependencyService } from '../../services/task-dependency.service';
import { Project } from '../../models/project.model';
import { Task } from '../../models/task.model';
import { forkJoin, map, switchMap, of } from 'rxjs';
import Gantt from 'frappe-gantt';
import { AuthService } from '../../auth/auth.service';
import { CreateTaskModalComponent } from '../create-task-modal/create-task-modal.component';

@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, CreateTaskModalComponent, ReactiveFormsModule],
  templateUrl: './project-detail.component.html',
  styleUrls: ['./project-detail.component.css']
})
export class ProjectDetailComponent implements OnInit {
  project: Project | null = null;
  ganttTasks: any[] = [];
  allProjectTasks: Task[] = [];
  isLoading = true;
  userRole: string | null = null;
  showCreateTaskModal = false;
  
  @ViewChild('gantt') ganttEl!: ElementRef;
  private gantt: any;
  selectedTask: any | null = null;
  isEditMode = false;
  editTaskForm: FormGroup;
  isProjectEditMode = false;
  editProjectForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private projectService: ProjectService,
    private taskService: TaskService,
    private taskDependencyService: TaskDependencyService,
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    this.editTaskForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      progress: [0, [Validators.min(0), Validators.max(100)]],
    });

    this.editProjectForm = this.fb.group({
      status: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.userRole = this.authService.getUserRole();
    const projectId = Number(this.route.snapshot.paramMap.get('id'));
    if (projectId) {
      this.loadProjectAndTasks(projectId);
    }
  }

  loadProjectAndTasks(projectId: number): void {
    this.isLoading = true;
    const project$ = this.projectService.getProjectById(projectId);
    const tasks$ = this.taskService.getTasksByProjectId(projectId);

    forkJoin({ project: project$, tasks: tasks$ }).pipe(
      switchMap(({ project, tasks }) => {
        this.project = project;
        this.allProjectTasks = tasks;
        if (tasks.length === 0) {
          return of([]);
        }
        const tasksWithDependencies$ = tasks.map(task => 
          this.taskDependencyService.getDependenciesByTaskId(task.id).pipe(
            map(dependencies => ({
              ...task,
              dependencies: dependencies.map(dep => dep.dependsOnTaskId.toString())
            }))
          )
        );
        return forkJoin(tasksWithDependencies$);
      })
    ).subscribe(tasksWithDeps => {
      this.ganttTasks = this.formatTasksForGantt(tasksWithDeps as Task[]);
      this.isLoading = false;
      this.initializeGantt(); 
    });
  }

  private formatTasksForGantt(tasks: Task[]): any[] {
    const validTasks = tasks.filter(task => 
      task && task.id && task.title && task.startDate && task.endDate
    );
    return validTasks.map(task => ({
      id: task.id.toString(),
      name: task.title,
      start: task.startDate,
      end: task.endDate,
      progress: task.progress || 0,
      dependencies: task.dependencies?.join(', ') || '',
      description: task.description || 'Sin descripción.',
      status: task.status || 'No definido',
      priority: task.priority || 'No definida',
      createdBy: task.createdByUserName || 'No definido',
      assignedTo: task.assignedUserName || 'No asignado'
    }));
  }

  private initializeGantt(): void {
    setTimeout(() => {
      if (this.ganttEl?.nativeElement) {
        this.ganttEl.nativeElement.innerHTML = ''; 
        if (this.ganttTasks.length > 0) {
          this.gantt = new Gantt(this.ganttEl.nativeElement, this.ganttTasks, {
            bar_height: 20,
            on_date_change: (task: any, start: Date, end: Date) => {
              const startDate = start.toISOString().split('T')[0];
              const endDate = end.toISOString().split('T')[0];
              this.taskService.updateTask(Number(task.id), { startDate, endDate }).subscribe({
                next: () => console.log(`Tarea ${task.id} actualizada.`),
                error: (err) => {
                  console.error(`Error al actualizar la tarea ${task.id}:`, err);
                  if(this.project) this.loadProjectAndTasks(this.project.id);
                }
              });
            },
            on_progress_change: (task: any, progress: number) => {
              this.taskService.updateTask(Number(task.id), { progress }).subscribe({
                next: () => {
                   const taskToUpdate = this.ganttTasks.find(t => t.id === task.id);
                   if(taskToUpdate) taskToUpdate.progress = progress;
                   if (progress === 100) {
                     if(this.project) this.loadProjectAndTasks(this.project.id);
                   }
                },
                error: (err) => {
                  console.error(`Error al actualizar el progreso de la tarea ${task.id}:`, err);
                  if(this.project) this.loadProjectAndTasks(this.project.id);
                }
              });
            },
            on_click: (task: any) => {
              this.selectedTask = task;
              this.isEditMode = false;
              this.editTaskForm.patchValue({
                title: task.name,
                description: task.description,
                progress: task.progress
              });
            },
          });
          this.gantt.change_view_mode('Day');
        }
      }
    }, 0);
  }

  updateTaskDetails(): void {
    if (this.selectedTask && this.editTaskForm.valid) {
      const taskId = Number(this.selectedTask.id);
      const updatedData = {
          title: this.editTaskForm.value.title,
          description: this.editTaskForm.value.description,
          progress: this.editTaskForm.value.progress,
      };

      this.taskService.updateTask(taskId, updatedData).subscribe({
        next: () => {
          this.isEditMode = false;
          if (this.project) {
            this.loadProjectAndTasks(this.project.id);
          }
          this.closePopup();
        },
        error: (err) => console.error(`Error al actualizar la tarea ${taskId}:`, err)
      });
    }
  }

  closePopup(): void {
    this.selectedTask = null;
    this.isEditMode = false;
  }

  deleteTask(): void {
    if (!this.selectedTask) return;
    const taskId = Number(this.selectedTask.id);
    const taskName = this.selectedTask.name;

    if (confirm(`¿Estás seguro de que quieres eliminar la tarea "${taskName}"?`)) {
      this.taskService.deleteTask(taskId).subscribe({
        next: () => {
          this.closePopup();
          if (this.project) {
            this.loadProjectAndTasks(this.project.id);
          }
        },
        error: (err) => console.error(`Error al eliminar la tarea ${taskId}:`, err)
      });
    }
  }

  enableProjectEditMode(): void {
    if (this.project) {
      this.editProjectForm.patchValue({
        status: this.project.status
      });
      this.isProjectEditMode = true;
    }
  }

  updateProjectStatus(): void {
    if (this.project && this.editProjectForm.valid) {
      const newStatus = this.editProjectForm.value.status;
      this.projectService.updateProject(this.project.id, { status: newStatus }).subscribe({
        next: (updatedProject) => {
          if (this.project) {
            this.project.status = updatedProject.status;
          }
          this.isProjectEditMode = false;
        },
        error: (err) => console.error('Error al actualizar el estado del proyecto:', err)
      });
    }
  }
}