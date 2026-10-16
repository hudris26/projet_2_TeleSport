import { Component, Input } from '@angular/core';
import { Kpi } from '../../models/kpi';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  @Input() titlePage: string | null = null;
  @Input() kpis?: Kpi[] | null;
}
