import {
  ApplicationConfig,
  importProvidersFrom,
  isDevMode,
  provideZoneChangeDetection,
} from "@angular/core";
import {
  provideRouter,
  withComponentInputBinding,
  withInMemoryScrolling,
  withRouterConfig,
} from "@angular/router";
import { provideTranslocoPersistTranslations } from "@jsverse/transloco-persist-translations";
import { routes } from "./app.routes";
import { provideAnimationsAsync } from "@angular/platform-browser/animations/async";
import { provideHttpClient, withInterceptors } from "@angular/common/http";
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from "@angular/material/form-field";
import { provideTransloco } from "@jsverse/transloco";
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';

import { TranslocoHttpLoader } from "./transloco-loader";

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(
      routes,
      withInMemoryScrolling({
        scrollPositionRestoration: "top",
      }),
      withComponentInputBinding(),
      withRouterConfig({ paramsInheritanceStrategy: "always" }),
    ),
    provideHttpClient(),
    provideTransloco({
      config: {
        availableLangs: ["en", "ar"],
        defaultLang: "en",
        // Remove this option if your application doesn't support changing language in runtime.
        reRenderOnLangChange: true,
        prodMode: false, //  !isDevMode(),
        // missingHandler: {
        //   logMissingKey: false,
        // },
      },
    }),
    provideTranslocoPersistTranslations({
      loader: TranslocoHttpLoader, // Auto-generated via ng add
      storage: { useValue: localStorage },
      ttl: 4000,
      // ttl: 86400, // Cache duration in seconds (1 day)
    }),
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { appearance: "outline" },
    },

    provideAnimationsAsync(),

    importProvidersFrom(
      CalendarModule.forRoot({
        provide: DateAdapter,
        useFactory: adapterFactory,
      })
    ),
  ],
};
