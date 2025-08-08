import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProjectService } from '../../services/project.service';
import { Project } from '../../models/project.model';
import { Observable, of } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { CreateProjectModalComponent } from '../create-project-modal/create-project-modal.component';

@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [CommonModule, RouterModule, CreateProjectModalComponent],
  templateUrl: './project-list.component.html',
})
export class ProjectListComponent implements OnInit {
  projects$!: Observable<Project[]>;
  userRole: string | null = null;
  showCreateProjectModal = false;

  constructor(
    private projectService: ProjectService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.userRole = this.authService.getUserRole();
    this.loadProjects();
  }

  loadProjects(): void {
    const companyId = this.authService.getCompanyId();
    if (companyId) {
      this.projects$ = this.projectService.getProjectsByCompanyId(companyId);
    } else {
      this.projects$ = of([]);
    }
  }

  deleteProject(projectId: number, projectName: string): void {
    if (confirm(`¿Estás seguro de que quieres eliminar el proyecto "${projectName}"? Se eliminarán también todas sus tareas asociadas.`)) {
      this.projectService.deleteProject(projectId).subscribe({
        next: () => {
          console.log(`Proyecto ${projectId} eliminado.`);
          this.loadProjects();
        },
        error: (err) => console.error(`Error al eliminar el proyecto ${projectId}:`, err)
      });
    }
  }
}