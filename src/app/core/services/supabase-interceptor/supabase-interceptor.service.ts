import { inject, Injectable, Injector } from "@angular/core";
import { LoadingService } from "../loading/loading.service";
import { SnackbarService } from "../snackbar/snackbar.service";
import { UserService } from "../user/user.service";
import { SupabaseService } from "../supabase/supabase.service";

@Injectable({
  providedIn: "root",
})
export class SupabaseInterceptorService {
  private loadingService = inject(LoadingService);
  private snackbarService = inject(SnackbarService);
  // Remove direct injection of UserService
  private injector = inject(Injector);

  // Use a getter to lazily retrieve UserService when needed
  private get supabaseService(): SupabaseService {
    return this.injector.get(SupabaseService);
  }
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
    const urlString = input instanceof URL ? input.toString() : input;

    try {
      const response = await fetch(input, init);

      console.log(urlString);

      if (
        typeof urlString === "string" &&
        urlString.includes("/auth/v1/token?grant_type=refresh_token")
      ) {
        return response;
      }

      if (!response.ok) {
        const errorText = await response.text();
        if (errorText.length) {
          const err = JSON.parse(errorText);
          if (err.error) {
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
        } else if (err.error) {
          this.snackbarService.error(err.error);
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

// import { inject, Injectable } from "@angular/core";
// import { LoadingService } from "../loading/loading.service";
// import { SnackbarService } from "../snackbar/snackbar.service";

// @Injectable({
//   providedIn: "root",
// })
// export class SupabaseInterceptorService {
//   private loadingService = inject(LoadingService);
//   private snackbarService = inject(SnackbarService);
//   constructor() {}
//   async fetchWrapper(input: RequestInfo, init?: RequestInit): Promise<Response>;
//   async fetchWrapper(input: URL, init?: RequestInit): Promise<Response>;
//   async fetchWrapper(
//     input: RequestInfo | URL,
//     init?: RequestInit,
//   ): Promise<Response> {
//     this.loadingService.show();
//     if (input instanceof URL) {
//       input = input.toString();
//     }

//     try {
//       const response = await fetch(input, init);

//       if (!response.ok) {
//         const errorText = await response.text();
//         console.log("Raw error response:", errorText); // Add logging

//         try {
//           const err = JSON.parse(errorText);
//           if (err?.error) {
//             this.snackbarService.error(err.error);
//           } else {
//             this.snackbarService.error(errorText);
//           }
//           throw new Error(JSON.stringify(err)); // Throw parsed error
//         } catch (parseError) {
//           this.snackbarService.error(errorText);
//           throw new Error(errorText);
//         }
//       }

//       return response;
//     } catch (error: any) {
//       console.log("Fetch error:", error); // Add logging
//       this.snackbarService.error(error.message || "Fetch error");
//       throw error;
//     } finally {
//       this.loadingService.hide();
//     }
//   }
// }
