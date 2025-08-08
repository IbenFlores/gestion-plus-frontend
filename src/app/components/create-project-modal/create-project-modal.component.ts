import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProjectService } from '../../services/project.service';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-create-project-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-project-modal.component.html',
  styleUrls: ['../project-detail/project-detail.component.css']
})
export class CreateProjectModalComponent {
  @Output() close = new EventEmitter<void>();
  @Output() projectCreated = new EventEmitter<void>();
  projectForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private projectService: ProjectService,
    private authService: AuthService
  ) {
    this.projectForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.projectForm.valid) {
      const companyId = this.authService.getCompanyId();
      if (companyId) {
        const projectData = { ...this.projectForm.value, companyId, status: 'PLANIFICADO' };
        this.projectService.createProject(projectData).subscribe(() => {
          this.projectCreated.emit();
          this.close.emit();
        });
      }
    }
  }
}
