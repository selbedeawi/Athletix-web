import { Component, inject } from "@angular/core";
import { BookedSessionsService } from "./services/booked-sessions.service";

@Component({
  selector: "app-booked-sessions",
  imports: [],
  templateUrl: "./booked-sessions.component.html",
  styleUrl: "./booked-sessions.component.scss",
})
export class BookedSessionsComponent {
  bookedSessionsService = inject(BookedSessionsService);
}
