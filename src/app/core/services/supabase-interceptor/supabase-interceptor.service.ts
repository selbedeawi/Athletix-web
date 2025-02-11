import { inject, Injectable } from "@angular/core";
import { LoadingService } from "../loading/loading.service";
import { SnackbarService } from "../snackbar/snackbar.service";

@Injectable({
  providedIn: "root",
})
export class SupabaseInterceptorService {
  private loadingService = inject(LoadingService);
  private snackbarService = inject(SnackbarService);
  constructor() {}
  async fetchWrapper(input: RequestInfo, init?: RequestInit): Promise<Response>;
  async fetchWrapper(input: URL, init?: RequestInit): Promise<Response>;
  async fetchWrapper(
    input: RequestInfo | URL,
    init?: RequestInit,
  ): Promise<Response> {
    this.loadingService.show();
    if (input instanceof URL) {
      input = input.toString();
    }

    try {
      const response = await fetch(input, init);
      if (!response.ok) {
        const errorText = await response.text();
        if (errorText.length) {
          const err = JSON.parse(errorText);
          if (err) {
            this.snackbarService.error(err.error);
          } else {
            this.snackbarService.error(errorText);
          }
        }
        throw new Error(errorText);
      }
      return response;
    } catch (error: any) {
      if (error?.message) {
        const err = JSON.parse(error.message);
        if (err?.message) {
          this.snackbarService.error(err.message);
        } else {
          this.snackbarService.error(error);
        }
      } else {
        this.snackbarService.error(error.message || "Fetch error");
      }

      throw error;
    } finally {
      this.loadingService.hide();
    }
  }
}
