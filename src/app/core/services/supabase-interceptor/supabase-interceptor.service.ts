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

    try {
      const urlString = input instanceof URL ? input.toString() : input;
      const response = await fetch(input, init);

      if (
        typeof urlString === "string" &&
        urlString.includes("/auth/v1/token?grant_type=refresh_token")
      ) {
        return response;
      }

      if (!response.ok) {
        const errorText = await response.text();
        try {
          const err = JSON.parse(errorText);
          this.snackbarService.error(err.error || err.message || errorText);
        } catch {
          this.snackbarService.error(errorText);
        }
        throw new Error(errorText);
      }

      return response;
    } catch (error: any) {
      const errorMessage = error?.message;
      try {
        const parsedError = JSON.parse(errorMessage);
        this.snackbarService.error(
          parsedError.error || parsedError.message || "Fetch error",
        );
      } catch {
        this.snackbarService.error(errorMessage || "Fetch error");
      }

      throw error;
    } finally {
      this.loadingService.hide();
    }
  }
}
