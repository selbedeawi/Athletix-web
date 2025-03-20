import { Component, inject, input } from "@angular/core";
import { BranchesService } from "../../services/branches/branches.service";
import { AsyncPipe } from "@angular/common";
import { MatMenuModule } from "@angular/material/menu";
import { MatButtonModule } from "@angular/material/button";

@Component({
  selector: "app-branch-select",
  imports: [
    AsyncPipe,
    MatButtonModule,
    MatMenuModule,
  ],
  templateUrl: "./branch-select.component.html",
  styleUrl: "./branch-select.component.scss",
})
export class BranchSelectComponent {
  branchesService = inject(BranchesService);
  staffId = input.required<string>();

  constructor() {}
  ngOnInit(): void {
    this.branchesService.getBranches(this.staffId());
  }
}
