import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ProtocolService } from '../services/protocol.service';

@Component({
  selector: 'app-protocol-selection',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './protocol-selection.component.html',
  styleUrls: ['./protocol-selection.component.css']
})
export class ProtocolSelectionComponent implements OnInit {
  protocolsByType: { [key: string]: any[] } = {};

  constructor(
    private protocolService: ProtocolService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.protocolService.getAllProtocolsGroupedByType().subscribe({
      next: data => {
        this.protocolsByType = data;
      },
      error: err => {
        console.error('Failed to load protocols:', err);
      }
    });
  }

  selectProtocol(protocolId: number) {
    this.router.navigate(['/report-create'], { queryParams: { protocolId } });
  }
}
